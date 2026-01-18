import { Command } from 'commander';
import { config, validateConfig } from './config.js';
import { logger } from './utils/logger.js';
import { closeBrowser } from './utils/browser.js';
import { login, ensureLoggedIn } from './actions/login.js';
import { likePostsInFeed, likePostsByHashtag } from './actions/like.js';
import { commentOnPosts, commentOnHashtag } from './actions/comment.js';
import { inviteConnectionsToPage, sendConnectionRequests } from './actions/invite.js';
import { createPost, createMultiplePosts } from './actions/post.js';
import { randomDelay, randomElement } from './utils/helpers.js';

const program = new Command();

program
  .name('linkedin-bot')
  .description('LinkedIn automation bot for likes, comments, invites, and posts')
  .version('1.0.0');

// Login command
program
  .command('login')
  .description('Login to LinkedIn and save session')
  .action(async () => {
    const errors = validateConfig();
    if (errors.length > 0) {
      errors.forEach((e) => logger.error(e));
      process.exit(1);
    }

    try {
      const success = await login();
      if (success) {
        logger.info('Login successful! Session saved.');
      } else {
        logger.error('Login failed');
      }
    } finally {
      await closeBrowser();
    }
  });

// Like command
program
  .command('like')
  .description('Like posts in feed or by hashtag')
  .option('-c, --count <number>', 'Number of posts to like', String(config.limits.likesPerDay))
  .option('-h, --hashtag <tag>', 'Like posts with specific hashtag')
  .action(async (options) => {
    try {
      const count = parseInt(options.count, 10);

      if (options.hashtag) {
        await likePostsByHashtag(options.hashtag, count);
      } else {
        await likePostsInFeed(count);
      }
    } finally {
      await closeBrowser();
    }
  });

// Comment command
program
  .command('comment')
  .description('Comment on posts with AI-generated comments')
  .option('-c, --count <number>', 'Number of posts to comment on', String(config.limits.commentsPerDay))
  .option('-h, --hashtag <tag>', 'Comment on posts with specific hashtag')
  .action(async (options) => {
    try {
      const count = parseInt(options.count, 10);

      if (options.hashtag) {
        await commentOnHashtag(options.hashtag, count);
      } else {
        await commentOnPosts(count);
      }
    } finally {
      await closeBrowser();
    }
  });

// Invite command
program
  .command('invite')
  .description('Invite connections to follow company page')
  .option('-c, --count <number>', 'Number of invites to send', String(config.limits.invitesPerDay))
  .option('-p, --page <url>', 'Company page URL', config.companyPageUrl)
  .action(async (options) => {
    try {
      const count = parseInt(options.count, 10);
      await inviteConnectionsToPage(options.page, count);
    } finally {
      await closeBrowser();
    }
  });

// Connect command
program
  .command('connect')
  .description('Send connection requests')
  .option('-c, --count <number>', 'Number of requests to send', '10')
  .option('-s, --search <query>', 'Search query to find people')
  .action(async (options) => {
    try {
      const count = parseInt(options.count, 10);
      await sendConnectionRequests(count, options.search);
    } finally {
      await closeBrowser();
    }
  });

// Post command
program
  .command('post')
  .description('Create a thematic post using AI')
  .option('-t, --topic <topic>', 'Topic for the post')
  .option('-c, --count <number>', 'Number of posts to create', '1')
  .action(async (options) => {
    try {
      const count = parseInt(options.count, 10);

      if (count === 1) {
        await createPost(options.topic);
      } else {
        await createMultiplePosts(count);
      }
    } finally {
      await closeBrowser();
    }
  });

// Auto command - runs a full automation cycle
program
  .command('auto')
  .description('Run automated engagement cycle (likes, comments, posts)')
  .option('--no-like', 'Skip liking posts')
  .option('--no-comment', 'Skip commenting')
  .option('--no-post', 'Skip posting')
  .option('--no-invite', 'Skip inviting to page')
  .action(async (options) => {
    logger.info('Starting automated LinkedIn engagement...');
    logger.info('Press Ctrl+C to stop');

    const errors = validateConfig();
    if (errors.length > 0) {
      errors.forEach((e) => logger.error(e));
      process.exit(1);
    }

    try {
      // Login first
      if (!(await ensureLoggedIn())) {
        logger.error('Could not log in. Exiting.');
        return;
      }

      // Engagement cycle
      const topics = config.topics;

      // 1. Like some posts
      if (options.like !== false) {
        logger.info('\n--- LIKING POSTS ---');
        const likesToday = Math.floor(config.limits.likesPerDay * (0.5 + Math.random() * 0.5));
        await likePostsInFeed(likesToday);
        await randomDelay(30000, 60000);

        // Like posts from a random topic hashtag
        const hashtag = randomElement(topics);
        await likePostsByHashtag(hashtag, 5);
        await randomDelay(30000, 60000);
      }

      // 2. Comment on posts
      if (options.comment !== false) {
        logger.info('\n--- COMMENTING ---');
        const commentsToday = Math.floor(config.limits.commentsPerDay * (0.5 + Math.random() * 0.5));
        await commentOnPosts(commentsToday);
        await randomDelay(60000, 120000);
      }

      // 3. Create a post
      if (options.post !== false) {
        logger.info('\n--- CREATING POST ---');
        const topic = randomElement(topics);
        await createPost(topic);
        await randomDelay(30000, 60000);
      }

      // 4. Invite to page
      if (options.invite !== false && config.companyPageUrl) {
        logger.info('\n--- INVITING TO PAGE ---');
        const invitesToday = Math.floor(config.limits.invitesPerDay * (0.3 + Math.random() * 0.4));
        await inviteConnectionsToPage(config.companyPageUrl, invitesToday);
      }

      logger.info('\n=== Automation cycle complete! ===');
    } catch (error) {
      logger.error(`Automation error: ${error}`);
    } finally {
      await closeBrowser();
    }
  });

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('\nShutting down...');
  await closeBrowser();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeBrowser();
  process.exit(0);
});

program.parse();
