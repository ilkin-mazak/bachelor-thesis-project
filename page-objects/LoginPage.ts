//LoginPage.ts
import { Page, expect } from "@playwright/test";
import { loadConfig } from "../helpers/config-loader.js";

export default class LoginPage {
  private readonly page: Page;
  public readonly config: ReturnType<typeof loadConfig>;
  private readonly selectors: any; // Changed from typeof config.selectors.login

  constructor(page: Page) {
    this.page = page;
    this.config = loadConfig();
    this.selectors = this.config.selectors.login;
  }

  async navigateToAccountLogin(): Promise<void> {
    await this.page.goto(
      `${this.config.baseURL}${this.config.paths.loginPage}`
    );
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.locator(this.selectors.username).fill(username);
    await this.page.locator(this.selectors.password).fill(password);
    await this.page.locator(this.selectors.submitButton).click();
  }

  async assertSuccessfulLogin(): Promise<void> {
    // 1. Verify URL pattern
    await expect(this.page).toHaveURL(
      new RegExp(`${this.config.baseURL}${this.config.paths.myAccount}/?$`)
    );

    // 2. Combined platform check
    const prestaShopSignOutButton = this.page.locator(
      this.selectors.signOutButton
    );
    const wooCommerceAccountHeading = this.page.getByRole(
      this.selectors.myAccountHeading.role as "heading",
      { name: this.selectors.myAccountHeading.name }
    );

    // 3. OR condition check
    await expect(
      prestaShopSignOutButton.or(wooCommerceAccountHeading)
    ).toBeVisible();
  }

  async assertLoginError(): Promise<void> {
    const expectedErrorMessage = this.config.errorMessages.loginError;
    await expect(this.page.locator(this.selectors.errorMessage)).toContainText(
      expectedErrorMessage
    );
  }
}
