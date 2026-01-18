import { config } from '../config.js';

/**
 * Random delay between min and max milliseconds
 */
export function randomDelay(min?: number, max?: number): Promise<void> {
  const minMs = min ?? config.limits.minDelay;
  const maxMs = max ?? config.limits.maxDelay;
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Longer delay between major actions
 */
export function actionDelay(): Promise<void> {
  const delay = config.limits.actionDelay + Math.random() * 10000;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Random scroll behavior to simulate human
 */
export async function humanScroll(page: any): Promise<void> {
  const scrolls = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < scrolls; i++) {
    const distance = Math.floor(Math.random() * 500) + 200;
    await page.evaluate((d: number) => window.scrollBy(0, d), distance);
    await randomDelay(500, 1500);
  }
}

/**
 * Type text with human-like delays
 */
export async function humanType(page: any, selector: string, text: string): Promise<void> {
  await page.click(selector);
  await randomDelay(200, 500);

  for (const char of text) {
    await page.keyboard.type(char, { delay: Math.random() * 100 + 50 });

    // Occasionally pause like a human thinking
    if (Math.random() < 0.1) {
      await randomDelay(200, 800);
    }
  }
}

/**
 * Get today's date string for tracking daily limits
 */
export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Random element from array
 */
export function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
