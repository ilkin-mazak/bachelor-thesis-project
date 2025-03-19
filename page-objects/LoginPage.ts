import { Page } from "@playwright/test";
import config from "../config/site-config.json" with { type: "json" };
import { expect } from '@playwright/test';  
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

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.page.locator(this.selectors.username).fill(username);
    await this.page.locator(this.selectors.password).fill(password);
  }

  async submitLogin(): Promise<void> {
    await this.page.locator(this.selectors.submitButton).click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.locator(this.selectors.username).fill(username);
    await this.page.locator(this.selectors.password).fill(password);
    await this.page.locator(this.selectors.submitButton).click();
  }
  
  async assertSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/my-account/);
    await expect(
      this.page.getByRole(
        this.selectors.myAccountHeading.role as "heading", // Type assertion
      { name: this.selectors.myAccountHeading.name }
      )
    ).toBeVisible();

  }

  async assertLoginError(): Promise<void> {
    await expect(this.page.locator(this.selectors.errorMessage))
      .toContainText('Unknown');
  }
}
