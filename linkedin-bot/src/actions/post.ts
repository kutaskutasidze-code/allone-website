import { getPage } from '../utils/browser.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { randomDelay, randomElement } from '../utils/helpers.js';
import { ensureLoggedIn } from './login.js';
import { generatePost } from '../utils/ai.js';

export async function createPost(topic?: string): Promise<boolean> {
  if (!(await ensureLoggedIn())) {
    logger.error('Must be logged in to post');
    return false;
  }

  const page = await getPage();

  // Use provided topic or random from config
  const postTopic = topic || randomElement(config.topics);

  logger.info(`Creating post about: ${postTopic}`);

  try {
    // Generate AI content
    const { content, hashtags } = await generatePost(postTopic);

    if (!content) {
      logger.error('Failed to generate post content');
      return false;
    }

    // Navigate to feed
    await page.goto('https://www.linkedin.com/feed/', {
      waitUntil: 'networkidle2',
    });

    await randomDelay(2000, 4000);

    // Click "Start a post" button
    const startPostButton = await page.$(
      'button.share-box-feed-entry__trigger, button[aria-label*="Start a post"]'
    );

    if (!startPostButton) {
      logger.error('Could not find "Start a post" button');
      return false;
    }

    await startPostButton.click();
    await randomDelay(1000, 2000);

    // Wait for the post modal to open
    await page.waitForSelector('.share-creation-state__text-editor, .ql-editor', {
      timeout: 10000,
    });

    await randomDelay(500, 1000);

    // Find the text editor
    const editor = await page.$(
      '.share-creation-state__text-editor .ql-editor, div[role="textbox"][aria-label*="Text editor"]'
    );

    if (!editor) {
      logger.error('Could not find post editor');
      return false;
    }

    // Click to focus
    await editor.click();
    await randomDelay(300, 600);

    // Build the full post content with hashtags
    const hashtagString = hashtags.map((h) => `#${h.replace('#', '')}`).join(' ');
    const fullContent = `${content}\n\n${hashtagString}`;

    // Type the content with human-like delays
    logger.info('Typing post content...');

    for (const char of fullContent) {
      await page.keyboard.type(char, { delay: Math.random() * 60 + 20 });

      // Occasional pause
      if (Math.random() < 0.05) {
        await randomDelay(200, 500);
      }
    }

    await randomDelay(1000, 2000);

    // Click the Post button
    const postButton = await page.$(
      'button.share-actions__primary-action, button[aria-label*="Post"]'
    );

    if (!postButton) {
      logger.error('Could not find Post button');
      return false;
    }

    await postButton.click();
    await randomDelay(2000, 4000);

    // Wait for the post to be submitted
    await page.waitForFunction(
      () => !document.querySelector('.share-box-feed-entry__trigger--active'),
      { timeout: 30000 }
    ).catch(() => {});

    logger.info('Post published successfully!');
    logger.info(`Content preview: ${content.slice(0, 100)}...`);

    return true;
  } catch (error) {
    logger.error(`Error creating post: ${error}`);
    return false;
  }
}

export async function createMultiplePosts(count: number = config.limits.postsPerDay): Promise<number> {
  let posted = 0;

  for (let i = 0; i < count; i++) {
    const topic = randomElement(config.topics);

    logger.info(`Creating post ${i + 1}/${count} about: ${topic}`);

    const success = await createPost(topic);

    if (success) {
      posted++;
    }

    // Long delay between posts to avoid detection
    if (i < count - 1) {
      const delayHours = 2 + Math.random() * 4; // 2-6 hours
      logger.info(`Waiting ${delayHours.toFixed(1)} hours before next post...`);
      await randomDelay(delayHours * 60 * 60 * 1000, delayHours * 60 * 60 * 1000 + 60000);
    }
  }

  logger.info(`Finished posting. Total: ${posted}/${count} posts`);
  return posted;
}

export async function shareArticle(articleUrl: string, comment?: string): Promise<boolean> {
  if (!(await ensureLoggedIn())) {
    return false;
  }

  const page = await getPage();

  logger.info(`Sharing article: ${articleUrl}`);

  try {
    await page.goto('https://www.linkedin.com/feed/', {
      waitUntil: 'networkidle2',
    });

    await randomDelay(2000, 4000);

    // Click "Start a post"
    const startPostButton = await page.$('button.share-box-feed-entry__trigger');
    if (!startPostButton) return false;

    await startPostButton.click();
    await randomDelay(1000, 2000);

    // Wait for editor
    await page.waitForSelector('.ql-editor', { timeout: 10000 });

    // Type comment if provided
    if (comment) {
      const editor = await page.$('.ql-editor');
      if (editor) {
        await editor.click();
        for (const char of comment) {
          await page.keyboard.type(char, { delay: Math.random() * 60 + 20 });
        }
        await randomDelay(500, 1000);
      }
    }

    // Paste the article URL
    await page.keyboard.type('\n\n' + articleUrl);
    await randomDelay(2000, 4000); // Wait for link preview

    // Post
    const postButton = await page.$('button.share-actions__primary-action');
    if (postButton) {
      await postButton.click();
      await randomDelay(2000, 4000);
      logger.info('Article shared successfully!');
      return true;
    }

    return false;
  } catch (error) {
    logger.error(`Error sharing article: ${error}`);
    return false;
  }
}
