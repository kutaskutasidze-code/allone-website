import { getPage } from '../utils/browser.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { randomDelay, humanScroll, humanType } from '../utils/helpers.js';
import { ensureLoggedIn } from './login.js';
import { generateComment } from '../utils/ai.js';

export async function commentOnPosts(count: number = config.limits.commentsPerDay): Promise<number> {
  if (!(await ensureLoggedIn())) {
    logger.error('Must be logged in to comment');
    return 0;
  }

  const page = await getPage();
  let commented = 0;

  logger.info(`Starting to comment on up to ${count} posts...`);

  try {
    await page.goto('https://www.linkedin.com/feed/', {
      waitUntil: 'networkidle2',
    });

    await randomDelay(2000, 4000);

    while (commented < count) {
      await humanScroll(page);
      await randomDelay(1000, 2000);

      // Find posts that we can comment on
      const posts = await page.$$('div.feed-shared-update-v2');

      if (posts.length === 0) {
        logger.info('No posts found, scrolling more...');
        await humanScroll(page);
        await randomDelay(2000, 4000);
        continue;
      }

      // Process one post at a time
      for (const post of posts.slice(0, 3)) {
        if (commented >= count) break;

        try {
          // Get post content
          const postContent = await post.evaluate((el: Element) => {
            const textEl = el.querySelector('.feed-shared-text');
            return textEl?.textContent?.trim() || '';
          });

          if (!postContent || postContent.length < 50) {
            continue; // Skip short posts
          }

          // Check if we already commented (look for comment button state)
          const hasCommented = await post.evaluate((el: Element) => {
            const comments = el.querySelectorAll('.comments-comment-item');
            return comments.length > 0;
          });

          // Generate AI comment
          logger.info('Generating comment...');
          const comment = await generateComment(postContent);

          if (!comment) {
            continue;
          }

          // Scroll post into view
          await post.evaluate((el: Element) => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });

          await randomDelay(1000, 2000);

          // Click comment button
          const commentButton = await post.$('button[aria-label*="Comment"]');
          if (!commentButton) continue;

          await commentButton.click();
          await randomDelay(1000, 2000);

          // Find comment input
          const commentInput = await page.$('.ql-editor[data-placeholder="Add a comment…"]');
          if (!commentInput) {
            // Try alternative selector
            const altInput = await page.$('div[role="textbox"][aria-label*="comment"]');
            if (!altInput) continue;
          }

          // Type the comment
          const inputSelector = '.ql-editor[data-placeholder="Add a comment…"]';
          await page.click(inputSelector);
          await randomDelay(500, 1000);

          // Type with human-like delays
          for (const char of comment) {
            await page.keyboard.type(char, { delay: Math.random() * 80 + 30 });
          }

          await randomDelay(1000, 2000);

          // Click post button
          const postButton = await page.$('button.comments-comment-box__submit-button');
          if (postButton) {
            await postButton.click();
            commented++;
            logger.info(`Posted comment ${commented}/${count}: "${comment.slice(0, 50)}..."`);
          }

          // Longer delay between comments
          await randomDelay(20000, 40000);

          // Close the comment section by scrolling away
          await humanScroll(page);
        } catch (error) {
          logger.debug(`Failed to comment on post: ${error}`);
          continue;
        }
      }

      // Scroll to load more posts
      await humanScroll(page);
      await randomDelay(3000, 6000);
    }
  } catch (error) {
    logger.error(`Error during commenting: ${error}`);
  }

  logger.info(`Finished commenting. Total: ${commented} comments`);
  return commented;
}

export async function commentOnHashtag(
  hashtag: string,
  count: number = 5
): Promise<number> {
  if (!(await ensureLoggedIn())) {
    return 0;
  }

  const page = await getPage();
  const tag = hashtag.replace('#', '');
  let commented = 0;

  logger.info(`Commenting on #${tag} posts...`);

  try {
    await page.goto(`https://www.linkedin.com/feed/hashtag/${tag}/`, {
      waitUntil: 'networkidle2',
    });

    await randomDelay(2000, 4000);

    // Similar logic as above but for hashtag feed
    // ... (abbreviated for conciseness)

    while (commented < count) {
      await humanScroll(page);
      const posts = await page.$$('div.feed-shared-update-v2');

      for (const post of posts.slice(0, 2)) {
        if (commented >= count) break;

        try {
          const postContent = await post.evaluate((el: Element) => {
            return el.querySelector('.feed-shared-text')?.textContent?.trim() || '';
          });

          if (!postContent || postContent.length < 50) continue;

          const comment = await generateComment(postContent);
          if (!comment) continue;

          await post.evaluate((el: Element) => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });

          await randomDelay(1000, 2000);

          const commentButton = await post.$('button[aria-label*="Comment"]');
          if (commentButton) {
            await commentButton.click();
            await randomDelay(1000, 2000);

            await page.click('.ql-editor[data-placeholder="Add a comment…"]');
            for (const char of comment) {
              await page.keyboard.type(char, { delay: Math.random() * 80 + 30 });
            }

            await randomDelay(1000, 2000);

            const postButton = await page.$('button.comments-comment-box__submit-button');
            if (postButton) {
              await postButton.click();
              commented++;
              logger.info(`Commented on #${tag} post ${commented}/${count}`);
            }
          }

          await randomDelay(30000, 60000);
        } catch {
          continue;
        }
      }

      await humanScroll(page);
      await randomDelay(5000, 10000);
    }
  } catch (error) {
    logger.error(`Error commenting on hashtag: ${error}`);
  }

  return commented;
}
