import { Page } from '@playwright/test';

export class LoginPage {
  constructor(readonly page: Page) {}
  async open() {
    await this.page.goto('https://example.com/login');
  }
  async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}