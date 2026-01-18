import 'dotenv/config';

export const config = {
  linkedin: {
    email: process.env.LINKEDIN_EMAIL || '',
    password: process.env.LINKEDIN_PASSWORD || '',
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
  },
  // Safety limits to avoid detection
  limits: {
    likesPerDay: parseInt(process.env.LIKES_PER_DAY || '30', 10),
    commentsPerDay: parseInt(process.env.COMMENTS_PER_DAY || '15', 10),
    invitesPerDay: parseInt(process.env.INVITES_PER_DAY || '20', 10),
    postsPerDay: parseInt(process.env.POSTS_PER_DAY || '2', 10),
    // Delays in milliseconds
    minDelay: parseInt(process.env.MIN_DELAY || '3000', 10),
    maxDelay: parseInt(process.env.MAX_DELAY || '8000', 10),
    // Longer delay between major actions
    actionDelay: parseInt(process.env.ACTION_DELAY || '30000', 10),
  },
  // Topics for thematic content
  topics: (process.env.TOPICS || 'AI,automation,business growth,technology').split(','),
  // Company page URL for invites
  companyPageUrl: process.env.COMPANY_PAGE_URL || '',
  // Session file path
  sessionPath: process.env.SESSION_PATH || './session',
  // Headless mode
  headless: process.env.HEADLESS !== 'false',
};

export function validateConfig(): string[] {
  const errors: string[] = [];

  if (!config.linkedin.email) {
    errors.push('LINKEDIN_EMAIL is required');
  }
  if (!config.linkedin.password) {
    errors.push('LINKEDIN_PASSWORD is required');
  }

  return errors;
}
