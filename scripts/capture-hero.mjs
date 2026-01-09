import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureHero() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Desktop screenshot
  console.log('Capturing desktop hero...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('section', { timeout: 10000 });

  // Wait for animations to settle
  await new Promise(r => setTimeout(r, 2000));

  // Capture just the hero section (first section)
  const heroSection = await page.$('section');
  if (heroSection) {
    await heroSection.screenshot({
      path: path.join(__dirname, '../public/images/hero-desktop.png'),
      type: 'png'
    });
    console.log('Desktop hero saved to public/images/hero-desktop.png');
  }

  // Mobile screenshot
  console.log('Capturing mobile hero...');
  await page.setViewport({ width: 390, height: 844 }); // iPhone 14 Pro dimensions
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('section', { timeout: 10000 });

  // Wait for animations to settle
  await new Promise(r => setTimeout(r, 2000));

  const heroSectionMobile = await page.$('section');
  if (heroSectionMobile) {
    await heroSectionMobile.screenshot({
      path: path.join(__dirname, '../public/images/hero-mobile.png'),
      type: 'png'
    });
    console.log('Mobile hero saved to public/images/hero-mobile.png');
  }

  await browser.close();
  console.log('Done!');
}

captureHero().catch(console.error);
