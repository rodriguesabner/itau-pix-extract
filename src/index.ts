import { Browser, Page } from 'puppeteer';
import dotenv from 'dotenv';
import { createObjectCsvWriter } from 'csv-writer';
import {
  closeInitalModal, extractTable, redirectToPixPage,
} from './helpers/balance.helper';
import { ExtractProps } from './interfaces/extract.interface';
import { pressPasswordOneByOne, translatePasswordKeysOnScreen } from './helpers/password.helper';
import loginHelper from './helpers/login.helper';
import engineHelper from './helpers/engine.helper';

dotenv.config();

class ExtractAccount {
  private browser: Browser;

  private page: Page;

  private access: { password: string; conta: string; agencia: string };

  constructor() {
    this.browser = new Browser();
    this.page = new Page();

    const agencia = process.env.AGENCIA ?? 'define';
    const conta = process.env.CONTA ?? 'define';
    const password = process.env.SENHA ?? 'define';

    this.access = {
      agencia,
      conta,
      password,
    };
  }

  async initPage() {
    const { browser, page } = await engineHelper();
    this.browser = browser;
    this.page = page;
  }

  async loginWithAgenciaConta() {
    await loginHelper(this.page, this.access);
  }

  async pressPassword() {
    const keys = await translatePasswordKeysOnScreen(this.page);

    const splittedPassword = this.access.password.split('');
    await pressPasswordOneByOne(this.page, splittedPassword, keys);
  }

  async getBalance(): Promise<null | (ExtractProps | null)[]> {
    await closeInitalModal(this.page);
    await redirectToPixPage(this.page);

    const balance = await extractTable(this.page);
    return balance;
  }

  async saveToCsv(data: ExtractProps[] | null) {
    if (!data) return;

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const csvWriter = createObjectCsvWriter({
      path: `pix-${month}-${year}.csv`,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'NAME' },
        { id: 'cpf', title: 'CPF' },
        { id: 'banco', title: 'BANCO' },
        { id: 'identificador', title: 'IDENTIFICADOR' },
        { id: 'valor', title: 'VALOR' },
        { id: 'data', title: 'DATA' },
      ],
    });

    const records = data.map((item) => ({
      id: item.id,
      name: item.name,
      cpf: item.cpf,
      banco: item.banco,
      identificador: item.descricao,
      valor: item.valor,
      data: item.data,
    }));

    await csvWriter.writeRecords(records);
    console.log('The CSV file was written successfully');
  }

  async startScrapping() {
    try {
      await this.initPage();
      await this.loginWithAgenciaConta();
      await this.pressPassword();

      const balance = await this.getBalance();
      await this.browser.close();

      // @ts-ignore
      await this.saveToCsv(balance);

      process.exit(0);
    } catch (error) {
      console.log(error);
      await this.browser.close();
    }
  }
}

new ExtractAccount().startScrapping();
