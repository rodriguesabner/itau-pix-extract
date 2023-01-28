import { Browser, Page, launch } from 'puppeteer';

export default async function engineHelper(): Promise<{ browser: Browser; page: Page }> {
  const hideBrowser = process.env.HIDE_BROWSER === 'true' ?? false;

  const browser = await launch({
    headless: hideBrowser,
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
  await page.setCacheEnabled(false);
  await page.setViewport({
    width: 1366,
    height: 768,
  });
  await page.goto('https://www.itau.com.br');
  return {
    browser,
    page,
  };
}
