import { Page } from 'puppeteer';

async function translatePasswordKeysOnScreen(page: Page): Promise<string[]> {
  const elementPasswordKeys = '.teclas a';

  await page.waitForTimeout(10000);
  await page.waitForSelector(
    elementPasswordKeys,
    { visible: true },
  );

  const keys = await page.evaluate((data: any) => {
    const buttons = Array.from(document.querySelectorAll(data));

    return buttons.map((tecla) => {
      const teclaPattern = `${tecla.textContent} = ${tecla.rel}`;
      return teclaPattern;
    });
  }, elementPasswordKeys);

  return keys;
}

async function pressPasswordOneByOne(page: Page, password: string[], keys: string[]) {
  const taskPassword: any[] = [];

  const sanitizedPasswordByBrowser = password.map((digit) => keys
    .filter((el: any) => el.includes(digit))[0]
    .split('= ')[1]);

  console.log('pressing password');
  sanitizedPasswordByBrowser.forEach((key, index) => {
    taskPassword.push(
      setTimeout(() => {
        page.click(`[rel="${key}"]`);
      }, 500 * index),
    );
  });

  await Promise.all(taskPassword);

  await page.waitForTimeout(5000);
  await page.click('#acessar');

  console.log('logged!');
}

export {
  translatePasswordKeysOnScreen,
  pressPasswordOneByOne,
};
