import { Page } from 'puppeteer';

interface CredentialsProps {
    conta: string;
    agencia: string
    senha?: string;
}

async function loginHelper(page: Page, credentials: CredentialsProps) {
  await page.goto('https://www.itau.com.br');
  console.log('page loaded and trying to login...');

  await page.waitForSelector('#agencia');

  await page.type('#agencia', credentials.agencia);
  await page.type('#conta', credentials.conta);

  const btnLoginSubmit = '.login_button';
  await page.waitForSelector(btnLoginSubmit);
  await page.click(btnLoginSubmit);
  console.log('login submitted');
}

export default loginHelper;
