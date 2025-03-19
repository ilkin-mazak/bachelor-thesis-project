import { Page } from "@playwright/test";
import config from "../config/site-config.json" with { type: "json" };
export default class LoginPage {
  private readonly page: Page;
  private readonly selectors: typeof config.selectors.login;

  constructor(page: Page) {
    this.page = page;
    this.selectors = config.selectors.login;
  }

  async navigateToLogin(): Promise<void> {
    await this.page.goto(`${config.baseURL}/my-account`);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.locator(this.selectors.username).fill(username);
    await this.page.locator(this.selectors.password).fill(password);
    await this.page.locator(this.selectors.submitButton).click();
  }
}
