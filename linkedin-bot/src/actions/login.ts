import { getPage, saveSession, isLoggedIn } from '../utils/browser.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { randomDelay, humanType } from '../utils/helpers.js';

export async function login(): Promise<boolean> {
  // Check if already logged in
  if (await isLoggedIn()) {
    return true;
  }

  const page = await getPage();

  logger.info('Logging in to LinkedIn...');

  try {
    // Go to login page
    await page.goto('https://www.linkedin.com/login', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    await randomDelay(1000, 2000);

    // Enter email
    logger.info('Entering credentials...');
    await humanType(page, '#username', config.linkedin.email);
    await randomDelay(500, 1000);

    // Enter password
    await humanType(page, '#password', config.linkedin.password);
    await randomDelay(500, 1000);

    // Click sign in button
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });

    // Check for security verification
    const url = page.url();

    if (url.includes('checkpoint') || url.includes('challenge')) {
      logger.warn('Security verification required!');
      logger.info('Please complete the verification manually in the browser.');
      logger.info('Waiting for manual verification (60 seconds)...');

      // Wait for manual verification
      await page.waitForNavigation({ timeout: 60000 }).catch(() => {});
    }

    // Verify login success
    const currentUrl = page.url();
    if (currentUrl.includes('/feed') || currentUrl.includes('/mynetwork')) {
      logger.info('Login successful!');
      await saveSession();
      return true;
    }

    // Check for common error messages
    const errorMessage = await page.evaluate(() => {
      const error = document.querySelector('.alert-content');
      return error?.textContent?.trim() || null;
    });

    if (errorMessage) {
      logger.error(`Login failed: ${errorMessage}`);
      return false;
    }

    logger.warn(`Unexpected page after login: ${currentUrl}`);
    return false;
  } catch (error) {
    logger.error(`Login error: ${error}`);
    return false;
  }
}

export async function ensureLoggedIn(): Promise<boolean> {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return await login();
  }

  return true;
}
