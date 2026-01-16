# Allone Sales Lead Scraper - Implementation Plan

## Overview

Automated sales lead generation system that scrapes potential clients from multiple sources, categorizes them by Allone's services, stores them in Supabase, and enables automated email outreach.

**Target Regions:** Georgia, Kazakhstan, Uzbekistan, Turkey, Armenia, Azerbaijan

**Budget:** ~€5/month (Hetzner VPS €4 + Domain ~$10/year)

---

## Allone Services (For Lead Categorization)

| Service | Target Keywords |
|---------|-----------------|
| **AI Chatbots** | customer support, call center, e-commerce, high volume |
| **Custom AI Solutions** | fintech, healthcare, insurance, data-heavy |
| **Workflow Automation** | logistics, manufacturing, import/export, multiple tools |
| **Website Development** | startup, hotel, restaurant, outdated website |
| **AI Consulting** | enterprise, digital transformation, innovation |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      HETZNER VPS (€4/mo)                        │
│                      Ubuntu 22.04 LTS                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    SCRAPER ENGINE                          │ │
│  │                    (Node.js + Puppeteer)                   │ │
│  │                                                            │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │ │
│  │  │ 2GIS        │ │ Yandex Maps │ │ Google Maps │          │ │
│  │  │ (KZ, UZ)    │ │ (GE,AM,AZ)  │ │ (TR)        │          │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘          │ │
│  │                                                            │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │ │
│  │  │ HeadHunter  │ │ Clutch.co   │ │ Directories │          │ │
│  │  │ (KZ, UZ)    │ │ (All)       │ │ (All)       │          │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘          │ │
│  │                                                            │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │ │
│  │  │ Kariyer.net │ │ Gov Regs    │ │ Yandex/DDG  │          │ │
│  │  │ (TR)        │ │ (All)       │ │ (Backup)    │          │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                 CONTACT EXTRACTOR                          │ │
│  │                 (Puppeteer + Cheerio)                      │ │
│  │                                                            │ │
│  │  - Visit company websites                                  │ │
│  │  - Extract emails from contact pages                       │ │
│  │  - Extract phone numbers                                   │ │
│  │  - Get company description/about text                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    CATEGORIZER                             │ │
│  │                    (Rule-based matching)                   │ │
│  │                                                            │ │
│  │  Industry keywords → Allone service match                  │ │
│  │  Score leads by relevance (1-100)                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    EMAIL QUEUE                             │ │
│  │                    (Bull/BullMQ)                           │ │
│  │                                                            │ │
│  │  - Queue top-scored leads for email                       │ │
│  │  - Rate limit: 100/day (Resend free tier)                 │ │
│  │  - Track sent/opened/replied                              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    RESEND API                              │ │
│  │                    (Free: 100/day, 3000/mo)                │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      SUPABASE       │
                    │    (Free tier)      │
                    │                     │
                    │  Tables:            │
                    │  - leads            │
                    │  - lead_sources     │
                    │  - scrape_jobs      │
                    │  - email_campaigns  │
                    │  - email_logs       │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   NEXT.JS APP       │
                    │   (Vercel)          │
                    │                     │
                    │  /sales/leads       │
                    │  /sales/campaigns   │
                    │  /sales/analytics   │
                    └─────────────────────┘
```

---

## Data Sources

### Tier 1 - Primary (Best data, easiest to scrape)

| Source | Countries | URL | Data Available |
|--------|-----------|-----|----------------|
| **2GIS** | KZ, UZ | 2gis.kz, 2gis.uz | Name, phone, address, website, category |
| **Yandex Maps** | GE, AM, AZ | yandex.com/maps | Name, phone, address, website, hours |
| **Google Maps** | TR | google.com/maps | Name, phone, website, reviews, address |

### Tier 2 - Business Registries (Official data)

| Country | Source | URL |
|---------|--------|-----|
| Kazakhstan | egov.kz | https://egov.kz |
| Uzbekistan | my.gov.uz | https://my.gov.uz |
| Georgia | rs.ge | https://rs.ge |
| Turkey | ticaretsicil.gov.tr | https://ticaretsicil.gov.tr |
| Armenia | e-register.am | https://e-register.am |
| Azerbaijan | taxes.gov.az | https://taxes.gov.az |

### Tier 3 - Intent Signals (Companies with budget)

| Source | Countries | URL | Why Valuable |
|--------|-----------|-----|--------------|
| **HeadHunter** | KZ, UZ | hh.kz, hh.uz | Hiring = growing company |
| **Kariyer.net** | TR | kariyer.net | Hiring = has budget |
| **Clutch.co** | All | clutch.co | Tech companies = ideal clients |

### Tier 4 - Industry Specific

| Source | Industry | URL |
|--------|----------|-----|
| B2B Marketplaces | Import/Export | alibaba.com, tradekey.com |
| Booking.com | Hotels | booking.com |
| TripAdvisor | Hospitality | tripadvisor.com |

### Tier 5 - Local Directories

| Country | Directories |
|---------|-------------|
| Georgia | yell.ge, business.gov.ge |
| Kazakhstan | yellowpages.kz, satu.kz |
| Uzbekistan | yellowpages.uz, satu.uz |
| Turkey | enpati.com, turkticaret.net |
| Armenia | spyur.am, armeniayp.com |
| Azerbaijan | sari-sehifeler.az, all.biz |

### Tier 6 - Backup Search Engines

| Source | Blocking Level |
|--------|----------------|
| Yandex Search | Light |
| DuckDuckGo | Almost none |

---

## Database Schema

### New Tables for Supabase

```sql
-- Lead sources configuration
CREATE TABLE lead_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'maps', 'directory', 'jobs', 'registry', 'search'
    base_url TEXT NOT NULL,
    countries TEXT[] NOT NULL, -- ['KZ', 'UZ', 'GE', 'TR', 'AM', 'AZ']
    is_active BOOLEAN DEFAULT true,
    scrape_config JSONB, -- source-specific configuration
    last_scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Main leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Company info
    company_name TEXT NOT NULL,
    company_name_local TEXT, -- Name in local language
    website TEXT,
    industry TEXT,
    company_size TEXT, -- 'small', 'medium', 'large', 'enterprise'
    description TEXT,

    -- Contact info
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT NOT NULL, -- 'KZ', 'UZ', 'GE', 'TR', 'AM', 'AZ'

    -- Social links
    linkedin_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,

    -- Categorization
    matched_service TEXT, -- 'chatbots', 'custom_ai', 'automation', 'website', 'consulting'
    relevance_score INTEGER DEFAULT 0, -- 0-100
    tags TEXT[],

    -- Source tracking
    source_id UUID REFERENCES lead_sources(id),
    source_url TEXT, -- Original URL where found

    -- Status
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'responded', 'qualified', 'rejected'
    notes TEXT,

    -- Email tracking
    email_sent_at TIMESTAMPTZ,
    email_opened_at TIMESTAMPTZ,
    email_replied_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicates
    UNIQUE(website),
    UNIQUE(email)
);

-- Scraping job tracking
CREATE TABLE scrape_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES lead_sources(id),
    status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    search_query TEXT,
    country TEXT,
    leads_found INTEGER DEFAULT 0,
    leads_new INTEGER DEFAULT 0,
    leads_duplicate INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email campaigns
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_template TEXT NOT NULL, -- With placeholders: {{company_name}}, {{service}}
    target_service TEXT, -- Which Allone service to pitch
    target_countries TEXT[],
    is_active BOOLEAN DEFAULT true,
    emails_sent INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_replied INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email logs
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    campaign_id UUID REFERENCES email_campaigns(id),
    resend_id TEXT, -- ID from Resend API
    status TEXT DEFAULT 'queued', -- 'queued', 'sent', 'delivered', 'opened', 'clicked', 'replied', 'bounced'
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_leads_country ON leads(country);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_matched_service ON leads(matched_service);
CREATE INDEX idx_leads_relevance_score ON leads(relevance_score DESC);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email_sent ON leads(email_sent_at);
CREATE INDEX idx_scrape_jobs_status ON scrape_jobs(status);
CREATE INDEX idx_email_logs_lead ON email_logs(lead_id);
CREATE INDEX idx_email_logs_campaign ON email_logs(campaign_id);

-- RLS Policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (sales team)
CREATE POLICY "Authenticated users can manage leads" ON leads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view sources" ON lead_sources
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view jobs" ON scrape_jobs
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage campaigns" ON email_campaigns
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view email logs" ON email_logs
    FOR ALL USING (auth.role() = 'authenticated');
```

---

## Scraper Project Structure

Create a separate Node.js project for the scraper (runs on Hetzner VPS):

```
allone-scraper/
├── package.json
├── .env
├── .env.example
├── tsconfig.json
├── README.md
│
├── src/
│   ├── index.ts                 # Main entry point
│   ├── config.ts                # Configuration
│   │
│   ├── scrapers/                # Individual scraper modules
│   │   ├── base.scraper.ts      # Base scraper class
│   │   ├── 2gis.scraper.ts      # 2GIS scraper
│   │   ├── yandex-maps.scraper.ts
│   │   ├── google-maps.scraper.ts
│   │   ├── headhunter.scraper.ts
│   │   ├── kariyer.scraper.ts
│   │   ├── clutch.scraper.ts
│   │   ├── directories.scraper.ts
│   │   └── search.scraper.ts    # Yandex/DDG search
│   │
│   ├── extractors/              # Contact extraction
│   │   ├── email.extractor.ts   # Extract emails from websites
│   │   ├── phone.extractor.ts   # Extract phone numbers
│   │   └── social.extractor.ts  # Extract social links
│   │
│   ├── categorizer/             # Lead categorization
│   │   ├── rules.ts             # Keyword matching rules
│   │   ├── scorer.ts            # Relevance scoring
│   │   └── index.ts
│   │
│   ├── email/                   # Email automation
│   │   ├── resend.client.ts     # Resend API wrapper
│   │   ├── templates.ts         # Email templates
│   │   ├── queue.ts             # Email queue (Bull)
│   │   └── tracker.ts           # Open/click tracking
│   │
│   ├── database/                # Supabase integration
│   │   ├── client.ts            # Supabase client
│   │   ├── leads.repo.ts        # Leads repository
│   │   ├── jobs.repo.ts         # Jobs repository
│   │   └── emails.repo.ts       # Email logs repository
│   │
│   ├── scheduler/               # Cron jobs
│   │   ├── scrape.cron.ts       # Daily scraping job
│   │   ├── email.cron.ts        # Email sending job
│   │   └── cleanup.cron.ts      # Data cleanup job
│   │
│   └── utils/
│       ├── browser.ts           # Puppeteer setup
│       ├── proxy.ts             # Proxy rotation (if needed)
│       ├── rate-limiter.ts      # Request throttling
│       ├── logger.ts            # Logging
│       └── helpers.ts           # Utility functions
│
├── scripts/
│   ├── seed-sources.ts          # Seed lead_sources table
│   └── test-scraper.ts          # Test individual scrapers
│
└── docker/
    ├── Dockerfile
    └── docker-compose.yml
```

---

## Environment Variables

### Scraper (.env)

```env
# Supabase
SUPABASE_URL=https://cywmdjldapzrnabsoosd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=sales@your-domain.com
RESEND_FROM_NAME=Allone Sales

# Scraper settings
SCRAPE_DELAY_MS=2000           # Delay between requests
MAX_CONCURRENT_BROWSERS=2       # Parallel browser instances
MAX_LEADS_PER_SEARCH=100       # Limit per search query
LOG_LEVEL=info

# Email settings
DAILY_EMAIL_LIMIT=100          # Resend free tier limit
MIN_RELEVANCE_SCORE=50         # Only email leads with score >= 50
```

---

## Search Queries Configuration

```typescript
// src/config.ts

export const SEARCH_QUERIES = {
  // AI Chatbots targets
  chatbots: [
    'customer support company',
    'call center',
    'e-commerce store',
    'online shop',
    'customer service outsourcing',
  ],

  // Custom AI targets
  custom_ai: [
    'fintech company',
    'healthcare clinic',
    'insurance company',
    'bank',
    'medical center',
    'diagnostic center',
  ],

  // Workflow Automation targets
  automation: [
    'logistics company',
    'manufacturing factory',
    'import export company',
    'freight forwarding',
    'warehouse',
    'distribution company',
    'supply chain',
  ],

  // Website Development targets
  website: [
    'hotel',
    'restaurant',
    'startup',
    'travel agency',
    'real estate agency',
    'law firm',
    'dental clinic',
  ],

  // AI Consulting targets
  consulting: [
    'enterprise company',
    'corporation',
    'holding company',
    'group of companies',
  ],
};

export const COUNTRIES = {
  KZ: { name: 'Kazakhstan', cities: ['Almaty', 'Astana', 'Shymkent', 'Aktobe'] },
  UZ: { name: 'Uzbekistan', cities: ['Tashkent', 'Samarkand', 'Bukhara', 'Namangan'] },
  GE: { name: 'Georgia', cities: ['Tbilisi', 'Batumi', 'Kutaisi'] },
  TR: { name: 'Turkey', cities: ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa'] },
  AM: { name: 'Armenia', cities: ['Yerevan', 'Gyumri'] },
  AZ: { name: 'Azerbaijan', cities: ['Baku', 'Ganja', 'Sumqayit'] },
};
```

---

## Categorization Rules

```typescript
// src/categorizer/rules.ts

export const CATEGORIZATION_RULES = {
  chatbots: {
    keywords: [
      'customer support', 'call center', 'contact center',
      'e-commerce', 'online store', 'marketplace',
      'customer service', 'help desk', 'support center',
      'retail', 'shop', 'store',
    ],
    industryMatch: ['retail', 'e-commerce', 'telecommunications', 'banking'],
    scoreBoost: 20, // Bonus points if hiring support staff
  },

  custom_ai: {
    keywords: [
      'fintech', 'healthcare', 'medical', 'insurance',
      'bank', 'finance', 'clinic', 'hospital',
      'diagnostic', 'laboratory', 'pharmaceutical',
      'analytics', 'data', 'research',
    ],
    industryMatch: ['healthcare', 'finance', 'insurance', 'pharmaceutical'],
    scoreBoost: 25,
  },

  automation: {
    keywords: [
      'logistics', 'freight', 'shipping', 'warehouse',
      'manufacturing', 'factory', 'production',
      'import', 'export', 'trading', 'distribution',
      'supply chain', 'inventory',
    ],
    industryMatch: ['logistics', 'manufacturing', 'trading', 'wholesale'],
    scoreBoost: 20,
  },

  website: {
    keywords: [
      'hotel', 'restaurant', 'cafe', 'tourism',
      'travel agency', 'real estate', 'property',
      'law firm', 'legal', 'dental', 'beauty salon',
      'startup', 'small business',
    ],
    industryMatch: ['hospitality', 'tourism', 'real estate', 'legal'],
    scoreBoost: 15,
  },

  consulting: {
    keywords: [
      'enterprise', 'corporation', 'holding',
      'group of companies', 'conglomerate',
      'digital transformation', 'innovation',
    ],
    industryMatch: ['enterprise', 'corporate'],
    scoreBoost: 30,
  },
};
```

---

## Email Templates

```typescript
// src/email/templates.ts

export const EMAIL_TEMPLATES = {
  chatbots: {
    subject: 'Automate {{company_name}} Customer Support with AI',
    body: `Hi,

I noticed {{company_name}} handles customer interactions and wanted to share how AI chatbots are helping similar companies in {{country}}:

- 94% of customer queries resolved automatically
- Available 24/7 in multiple languages
- Reduces support costs by 60%

Would a 15-minute call to explore this make sense?

Best regards,
Allone Team

---
Unsubscribe: {{unsubscribe_link}}`
  },

  automation: {
    subject: 'Streamline {{company_name}} Operations',
    body: `Hi,

Companies in {{industry}} like {{company_name}} often struggle with manual data entry and disconnected tools.

Our workflow automation has helped businesses:
- Eliminate 80% of manual data entry
- Connect existing tools seamlessly
- Reduce operational errors by 95%

Interested in seeing how this could work for {{company_name}}?

Best regards,
Allone Team

---
Unsubscribe: {{unsubscribe_link}}`
  },

  // Add more templates for other services...
};
```

---

## Sales Portal UI (Next.js)

### New Pages to Create

```
src/app/sales/
├── layout.tsx              # Sales portal layout
├── page.tsx                # Dashboard overview
├── leads/
│   ├── page.tsx            # Lead list with filters
│   └── [id]/
│       └── page.tsx        # Individual lead detail
├── campaigns/
│   ├── page.tsx            # Email campaigns list
│   ├── new/
│   │   └── page.tsx        # Create new campaign
│   └── [id]/
│       └── page.tsx        # Campaign detail & stats
├── sources/
│   └── page.tsx            # Data sources status
├── jobs/
│   └── page.tsx            # Scraping jobs history
└── analytics/
    └── page.tsx            # Charts and metrics
```

### API Routes

```
src/app/api/sales/
├── leads/
│   ├── route.ts            # GET (list), POST (create)
│   └── [id]/
│       └── route.ts        # GET, PATCH, DELETE
├── campaigns/
│   ├── route.ts            # GET, POST
│   └── [id]/
│       └── route.ts        # GET, PATCH, DELETE
├── sources/
│   └── route.ts            # GET, PATCH
├── jobs/
│   └── route.ts            # GET
├── analytics/
│   └── route.ts            # GET
└── export/
    └── route.ts            # GET (CSV export)
```

---

## Implementation Phases

### Phase 1: Database Setup
1. Add new tables to Supabase (leads, lead_sources, scrape_jobs, email_campaigns, email_logs)
2. Run migrations
3. Seed initial lead_sources data

### Phase 2: Sales Portal UI
1. Create sales layout and navigation
2. Build leads list page with filters (country, status, service, score)
3. Build lead detail page
4. Build campaigns management pages
5. Add CSV export functionality

### Phase 3: Scraper Engine (Node.js project)
1. Set up project structure
2. Implement base scraper class
3. Build individual scrapers:
   - 2GIS (Kazakhstan, Uzbekistan)
   - Yandex Maps (Georgia, Armenia, Azerbaijan)
   - Google Maps (Turkey)
   - HeadHunter (Kazakhstan, Uzbekistan)
   - Kariyer.net (Turkey)
   - Clutch.co (All)
   - Local directories
4. Build contact extractor (emails, phones from websites)
5. Build categorizer and scorer

### Phase 4: Email Integration
1. Set up Resend account and domain
2. Implement email queue with Bull
3. Build email templates
4. Add open/click tracking
5. Implement daily email cron job

### Phase 5: Deployment
1. Set up Hetzner VPS
2. Install Node.js, Puppeteer dependencies
3. Configure PM2 for process management
4. Set up cron jobs
5. Configure logging and monitoring

---

## VPS Setup Instructions (Hetzner)

### 1. Create VPS
- Go to https://console.hetzner.cloud
- Create new project
- Add server: Ubuntu 22.04, CX11 (€3.79/mo)
- Add SSH key

### 2. Initial Setup
```bash
# Connect
ssh root@YOUR_SERVER_IP

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install Puppeteer dependencies
apt install -y chromium-browser libgbm1 libnss3 libatk-bridge2.0-0 libxkbcommon0 libgtk-3-0

# Install PM2
npm install -g pm2

# Create app user
adduser allone
usermod -aG sudo allone
```

### 3. Deploy Scraper
```bash
# As allone user
su - allone

# Clone scraper repo
git clone https://github.com/YOUR_REPO/allone-scraper.git
cd allone-scraper

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
nano .env  # Fill in values

# Build
npm run build

# Start with PM2
pm2 start dist/index.js --name allone-scraper
pm2 save
pm2 startup
```

### 4. Set Up Cron Jobs
```bash
# Edit crontab
crontab -e

# Add daily scrape job (3 AM)
0 3 * * * cd /home/allone/allone-scraper && /usr/bin/node dist/scheduler/scrape.cron.js >> /var/log/allone-scrape.log 2>&1

# Add email job (every hour, 9 AM - 6 PM)
0 9-18 * * * cd /home/allone/allone-scraper && /usr/bin/node dist/scheduler/email.cron.js >> /var/log/allone-email.log 2>&1
```

---

## Expected Results

| Metric | Monthly Estimate |
|--------|------------------|
| Leads scraped | 15,000 - 25,000 |
| With email | 6,000 - 15,000 (40-60%) |
| With phone | 10,000 - 20,000 (60-80%) |
| Emails sent | 3,000 (Resend limit) |
| Expected replies | 30-90 (1-3% rate) |
| Qualified leads | 10-30 |

---

## Costs Summary

| Item | Monthly Cost |
|------|--------------|
| Hetzner VPS (CX11) | €3.79 |
| Supabase | Free |
| Resend | Free (3K emails) |
| Domain (yearly/12) | ~$1 |
| **Total** | **~€5/month** |

---

## Future Enhancements (Optional)

1. **AI Categorization** - Use Claude/GPT API to analyze company descriptions
2. **LinkedIn Integration** - Manual enrichment with LinkedIn data
3. **CRM Integration** - Export to HubSpot, Pipedrive
4. **WhatsApp Outreach** - Add WhatsApp messaging via Twilio
5. **Lead Scoring ML** - Train model on successful conversions
6. **Multi-language Templates** - Russian, Turkish, Georgian templates
7. **Proxy Rotation** - Add residential proxies for scale

---

## Notes

- Start with Tier 1 sources (2GIS, Yandex Maps, Google Maps)
- Add other sources incrementally
- Monitor scraping success rates and adjust delays
- Warm up email domain slowly (20/day → 50 → 100)
- Always include unsubscribe link (legal requirement)
- Track which sources produce best leads
- Clean database of bounced emails regularly
