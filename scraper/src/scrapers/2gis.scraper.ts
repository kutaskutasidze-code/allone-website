import { BaseScraper, ScrapeResult } from './base.scraper.js';
import { LeadData } from '../database/client.js';
import { config } from '../config.js';

export class TwoGisScraper extends BaseScraper {
  getName(): string {
    return '2GIS';
  }

  async scrape(query: string, city: string, country: string): Promise<ScrapeResult> {
    const leads: LeadData[] = [];
    const errors: string[] = [];

    try {
      const page = await this.getPage();

      // Determine the correct 2GIS domain based on country
      const domain = country === 'KZ' ? '2gis.kz' : country === 'UZ' ? '2gis.uz' : '2gis.ru';
      const searchUrl = `https://${domain}/search/${encodeURIComponent(query)}%20${encodeURIComponent(city)}`;

      this.log(`Searching: ${searchUrl}`);

      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.delay(2000);

      // Wait for results to load
      try {
        await page.waitForSelector('[class*="businessList"]', { timeout: 10000 });
      } catch {
        this.log('No results found or selector changed', 'debug');
        return { leads, errors, hasMore: false };
      }

      // Scroll to load more results
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollBy(0, 500));
        await this.delay(1000);
      }

      // Extract business data
      const businesses = await page.evaluate(() => {
        const items: Array<{
          name: string;
          phone?: string;
          website?: string;
          address?: string;
          category?: string;
        }> = [];

        // 2GIS uses various class names, try multiple selectors
        const cards = document.querySelectorAll('[class*="businessList"] > div, [class*="_card"]');

        cards.forEach((card) => {
          const nameEl = card.querySelector('[class*="_name"], [class*="title"], h3');
          const phoneEl = card.querySelector('[class*="_phone"], [href^="tel:"]');
          const websiteEl = card.querySelector('[class*="_website"], a[target="_blank"]');
          const addressEl = card.querySelector('[class*="_address"], [class*="address"]');
          const categoryEl = card.querySelector('[class*="_category"], [class*="rubric"]');

          if (nameEl) {
            const name = nameEl.textContent?.trim() || '';
            if (name && name.length > 2) {
              items.push({
                name,
                phone: phoneEl?.textContent?.trim() || (phoneEl as HTMLAnchorElement)?.href?.replace('tel:', ''),
                website: (websiteEl as HTMLAnchorElement)?.href || '',
                address: addressEl?.textContent?.trim() || '',
                category: categoryEl?.textContent?.trim() || '',
              });
            }
          }
        });

        return items;
      });

      this.log(`Found ${businesses.length} businesses`);

      // Convert to LeadData format
      for (const biz of businesses.slice(0, config.scraper.maxLeadsPerSearch)) {
        const lead: LeadData = {
          name: biz.name,
          company: biz.name,
          phone: biz.phone ? this.normalizePhone(biz.phone) : undefined,
          website: biz.website ? this.normalizeUrl(biz.website) : undefined,
          address: biz.address,
          city,
          country,
          industry: biz.category,
          source_id: this.source.id,
          source_url: searchUrl,
          is_scraped: true,
        };

        leads.push(lead);
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      this.log(`Scrape error: ${errorMsg}`, 'error');
      errors.push(errorMsg);
    }

    return {
      leads,
      errors,
      hasMore: leads.length >= config.scraper.maxLeadsPerSearch,
    };
  }
}
