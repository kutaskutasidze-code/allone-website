import { getPage } from '../utils/browser.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { randomDelay, humanScroll } from '../utils/helpers.js';
import { ensureLoggedIn } from './login.js';

export async function inviteConnectionsToPage(
  pageUrl: string = config.companyPageUrl,
  count: number = config.limits.invitesPerDay
): Promise<number> {
  if (!(await ensureLoggedIn())) {
    logger.error('Must be logged in to send invites');
    return 0;
  }

  if (!pageUrl) {
    logger.error('Company page URL is required. Set COMPANY_PAGE_URL in .env');
    return 0;
  }

  const page = await getPage();
  let invited = 0;

  logger.info(`Inviting connections to follow page: ${pageUrl}`);

  try {
    // Navigate to the company page
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });
    await randomDelay(2000, 4000);

    // Click on "Admin tools" dropdown or find invite button
    // LinkedIn's structure varies, so we'll try multiple approaches

    // Approach 1: Look for "Invite connections" button directly
    let inviteButton: Awaited<ReturnType<typeof page.$>> = await page.$('button[aria-label*="Invite"]');

    if (!inviteButton) {
      // Approach 2: Look in admin tools menu
      const adminButton = await page.$('button[aria-label*="Admin"]');
      if (adminButton) {
        await adminButton.click();
        await randomDelay(500, 1000);
        inviteButton = await page.$('div[role="menuitem"]');
      }
    }

    if (!inviteButton) {
      // Approach 3: Look for the invite link in the page
      const inviteLink = await page.$('a[href*="invite"]');
      if (inviteLink) {
        await inviteLink.click();
        await randomDelay(1000, 2000);
      } else {
        // Approach 4: Navigate directly to invite page
        const pageId = pageUrl.split('/company/')[1]?.split('/')[0];
        if (pageId) {
          await page.goto(`https://www.linkedin.com/company/${pageId}/admin/invite/`, {
            waitUntil: 'networkidle2',
          });
        }
      }
    } else {
      await inviteButton.click();
    }

    await randomDelay(2000, 4000);

    // Now we should be on the invite modal/page
    // Find connection checkboxes

    while (invited < count) {
      // Look for unchecked connection items
      const connectionItems = await page.$$('li.invite-member-item:not(.invited)');

      if (connectionItems.length === 0) {
        // Try to scroll to load more
        await humanScroll(page);
        await randomDelay(2000, 3000);

        const moreItems = await page.$$('li.invite-member-item:not(.invited)');
        if (moreItems.length === 0) {
          logger.info('No more connections to invite');
          break;
        }
      }

      for (const item of connectionItems.slice(0, 5)) {
        if (invited >= count) break;

        try {
          // Click the checkbox or invite button for this connection
          const checkbox = await item.$('input[type="checkbox"]');
          if (checkbox) {
            const isChecked = await checkbox.evaluate(
              (el: HTMLInputElement) => el.checked
            );
            if (!isChecked) {
              await checkbox.click();
              invited++;
              logger.info(`Selected connection ${invited}/${count}`);
              await randomDelay(500, 1500);
            }
          } else {
            // Alternative: click invite button directly
            const inviteBtn = await item.$('button');
            if (inviteBtn) {
              await inviteBtn.click();
              invited++;
              logger.info(`Invited connection ${invited}/${count}`);
              await randomDelay(2000, 4000);
            }
          }
        } catch (error) {
          logger.debug(`Failed to invite connection: ${error}`);
          continue;
        }
      }

      // If we're selecting multiple, click the main invite button periodically
      if (invited > 0 && invited % 10 === 0) {
        const sendInvitesBtn = await page.$('button:has-text("Invite")');
        if (sendInvitesBtn) {
          await sendInvitesBtn.click();
          logger.info(`Sent batch of invites`);
          await randomDelay(3000, 5000);
        }
      }

      await randomDelay(1000, 2000);
    }

    // Send any remaining invites
    const finalInviteBtn = await page.$('button:has-text("Invite")');
    if (finalInviteBtn) {
      await finalInviteBtn.click();
      await randomDelay(2000, 4000);
    }
  } catch (error) {
    logger.error(`Error sending invites: ${error}`);
  }

  logger.info(`Finished inviting. Total: ${invited} connections`);
  return invited;
}

export async function sendConnectionRequests(
  count: number = 10,
  searchQuery?: string
): Promise<number> {
  if (!(await ensureLoggedIn())) {
    return 0;
  }

  const page = await getPage();
  let sent = 0;

  logger.info(`Sending connection requests...`);

  try {
    // Go to "My Network" suggestions or search
    if (searchQuery) {
      await page.goto(
        `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchQuery)}`,
        { waitUntil: 'networkidle2' }
      );
    } else {
      await page.goto('https://www.linkedin.com/mynetwork/', {
        waitUntil: 'networkidle2',
      });
    }

    await randomDelay(2000, 4000);

    while (sent < count) {
      // Find "Connect" buttons
      const connectButtons = await page.$$('button[aria-label*="connect" i], button:has-text("Connect")');

      if (connectButtons.length === 0) {
        await humanScroll(page);
        await randomDelay(2000, 4000);
        continue;
      }

      for (const button of connectButtons.slice(0, 3)) {
        if (sent >= count) break;

        try {
          await button.evaluate((el: Element) => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });

          await randomDelay(500, 1500);
          await button.click();

          // Handle the modal that might appear
          await randomDelay(1000, 2000);

          // Check if there's a "Send without a note" option
          const sendButton = await page.$('button[aria-label*="Send without a note"], button:has-text("Send")');
          if (sendButton) {
            await sendButton.click();
          }

          sent++;
          logger.info(`Sent connection request ${sent}/${count}`);

          // Close any modal
          const closeButton = await page.$('button[aria-label="Dismiss"]');
          if (closeButton) {
            await closeButton.click();
          }

          await randomDelay(5000, 15000);
        } catch (error) {
          logger.debug(`Failed to send connection request: ${error}`);
          continue;
        }
      }

      await humanScroll(page);
      await randomDelay(3000, 6000);
    }
  } catch (error) {
    logger.error(`Error sending connection requests: ${error}`);
  }

  logger.info(`Finished. Total connection requests sent: ${sent}`);
  return sent;
}
