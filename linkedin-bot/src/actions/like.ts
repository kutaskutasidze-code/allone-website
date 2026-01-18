import { getPage } from '../utils/browser.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { randomDelay, humanScroll, randomElement } from '../utils/helpers.js';
import { ensureLoggedIn } from './login.js';

export async function likePostsInFeed(count: number = config.limits.likesPerDay): Promise<number> {
  if (!(await ensureLoggedIn())) {
    logger.error('Must be logged in to like posts');
    return 0;
  }

  const page = await getPage();
  let liked = 0;

  logger.info(`Starting to like up to ${count} posts...`);

  try {
    // Go to feed
    await page.goto('https://www.linkedin.com/feed/', {
      waitUntil: 'networkidle2',
    });

    await randomDelay(2000, 4000);

    while (liked < count) {
      // Scroll to load more posts
      await humanScroll(page);
      await randomDelay(1000, 2000);

      // Find like buttons that haven't been clicked
      const likeButtons = await page.$$('button[aria-label*="Like"]:not([aria-pressed="true"])');

      if (likeButtons.length === 0) {
        logger.info('No more unliked posts found, scrolling more...');
        await humanScroll(page);
        await randomDelay(2000, 4000);
        continue;
      }

      // Pick a random like button to seem more natural
      const button = randomElement(likeButtons.slice(0, 5));

      try {
        // Scroll button into view
        await button.evaluate((el: Element) => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        await randomDelay(500, 1500);

        // Click the like button
        await button.click();
        liked++;

        logger.info(`Liked post ${liked}/${count}`);

        // Random delay between likes
        await randomDelay(3000, 8000);

        // Occasionally take a longer break
        if (liked % 5 === 0) {
          logger.info('Taking a short break...');
          await randomDelay(15000, 30000);
        }
      } catch (error) {
        logger.debug(`Failed to like a post: ${error}`);
        continue;
      }
    }
  } catch (error) {
    logger.error(`Error during liking: ${error}`);
  }

  logger.info(`Finished liking. Total: ${liked} posts`);
  return liked;
}

export async function likePostsByHashtag(hashtag: string, count: number = 10): Promise<number> {
  if (!(await ensureLoggedIn())) {
    return 0;
  }

  const page = await getPage();
  let liked = 0;

  // Remove # if present
  const tag = hashtag.replace('#', '');

  logger.info(`Liking posts with #${tag}...`);

  try {
    await page.goto(`https://www.linkedin.com/feed/hashtag/${tag}/`, {
      waitUntil: 'networkidle2',
    });

    await randomDelay(2000, 4000);

    while (liked < count) {
      await humanScroll(page);
      await randomDelay(1000, 2000);

      const likeButtons = await page.$$('button[aria-label*="Like"]:not([aria-pressed="true"])');

      if (likeButtons.length === 0) {
        await humanScroll(page);
        await randomDelay(2000, 4000);
        continue;
      }

      const button = randomElement(likeButtons.slice(0, 3));

      try {
        await button.evaluate((el: Element) => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        await randomDelay(500, 1500);
        await button.click();
        liked++;
        logger.info(`Liked #${tag} post ${liked}/${count}`);
        await randomDelay(3000, 8000);
      } catch {
        continue;
      }
    }
  } catch (error) {
    logger.error(`Error liking hashtag posts: ${error}`);
  }

  return liked;
}
