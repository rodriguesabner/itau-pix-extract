import { Page } from 'puppeteer';
import { ExtractProps } from '../interfaces/extract.interface';

async function closeInitalModal(page: Page) {
  const overlayModal = '#overlayPopupH2OID';
  await page.waitForTimeout(5000);

  try {
    await page.waitForSelector(overlayModal, { visible: true });

    const accordionExtract = '#saldo-extrato-card-accordion';
    await page.waitForSelector(accordionExtract, { visible: true });
    await page.click(accordionExtract);

    console.log('closing inital modal');
  } catch (e) {
    console.log('no overlay modal');
  }
}

async function redirectToPixPage(page: Page) {
  const pixButtonEl = '#boxPix div h2 a';
  await page.waitForSelector(pixButtonEl);
  await page.click(pixButtonEl);

  console.log('entering pix page');

  const extractPixEl = '#render-angular-app > app-central-pix > div:nth-child(3) > div > div > div > card-pix > div > voxel-button > button';

  await page.waitForTimeout(2000);
  await page.waitForSelector(extractPixEl, { visible: true });
  await page.click(extractPixEl);

  console.log('accessing extract');

  await page.waitForTimeout(1000);
  await page.waitForSelector('#fechar-modal-onboarding-pix');
  await page.click('#fechar-modal-onboarding-pix');
}

function sanitizeResponse(item: any): ExtractProps | null {
  const [_, price, raw] = item;

  const paramToProceed = raw.match(/transferência recebida de:/i);
  if (paramToProceed == null) {
    return null;
  }
  const id = raw.match(/ID\s+(.*)/i)[1];
  const name = raw.match(/nome\s+(.*)/i)[1];
  const cpf = raw.match(/cpf\/cnpj\s+(.*)/i)[1];
  const banco = raw.match(/banco\s+(.*)/i)[1];
  const date = raw.match(/data\s+(.*)/i)[1];

  let description = raw.match(/descrição\s+(.*)/i);
  if (description == null) {
    description = null;
  } else {
    const formattedDescription = raw.match(/descrição\s+(.*)/i)[1];
    description = formattedDescription;
  }

  return {
    id,
    name,
    cpf,
    banco,
    descricao: description,
    valor: price,
    data: date,
  };
}

async function extractTable(page: Page): Promise<(ExtractProps | null)[]> {
  const lancamentoTableEl = '#tabela-lancamentos';
  await page.waitForSelector(lancamentoTableEl, { visible: true });
  const lancamentoTable = await page.$(lancamentoTableEl);

  if (!lancamentoTable) return [null];

  const dataTable = await lancamentoTable.evaluate((table) => {
    const body = table.querySelectorAll('tbody');

    return Array.from(body, (items) => {
      if (!items) return null;

      const trs = items.querySelectorAll('tr');

      return Array.from(trs, (tr) => {
        const tds = tr.querySelectorAll('td');

        return Array
          .from(tds, (td) => td.innerText)
          .filter((item) => item !== '')
          .map((item) => item.trim());
      });
    });
  }) ?? [];

  console.log('received pix data');

  const sanitizeTable = dataTable
    .filter((item) => item && item.flat().length > 0)
    .map((item) => item && item.flat());

  const extract = sanitizeTable
    .map((item) => sanitizeResponse(item))
    .filter((item) => item !== null)
    .map((item) => item);

  return extract;
}

export {
  closeInitalModal,
  redirectToPixPage,
  extractTable,
  sanitizeResponse,
};
