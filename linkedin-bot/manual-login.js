import puppeteer from 'puppeteer';
import fs from 'fs';

const SESSION_PATH = './session';

async function manualLogin() {
  console.log('Opening browser for manual login...');
  console.log('Please login to LinkedIn manually in the browser window.');
  console.log('After logging in successfully, press Enter in this terminal to save the session.\n');

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080 },
  });

  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/login');

  // Wait for user input
  process.stdin.setRawMode(true);
  process.stdin.resume();
  await new Promise(resolve => process.stdin.once('data', resolve));

  console.log('\nSaving session...');

  // Save cookies
  const cookies = await page.cookies();
  if (!fs.existsSync(SESSION_PATH)) {
    fs.mkdirSync(SESSION_PATH, { recursive: true });
  }
  fs.writeFileSync(`${SESSION_PATH}/cookies.json`, JSON.stringify(cookies, null, 2));

  // Save localStorage
  const localStorage = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) data[key] = window.localStorage.getItem(key);
    }
    return data;
  });
  fs.writeFileSync(`${SESSION_PATH}/localStorage.json`, JSON.stringify(localStorage, null, 2));

  console.log('Session saved successfully!');
  await browser.close();
}

manualLogin();
