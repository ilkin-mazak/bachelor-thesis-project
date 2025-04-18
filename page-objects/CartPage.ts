//CartPage.ts
import { Page, Locator, expect } from "@playwright/test";
import { loadConfig } from "../helpers/config-loader.js";
import { assertVisible } from "../helpers.js";

export default class CartPage {
  private readonly page: Page;
  public readonly config: ReturnType<typeof loadConfig>; // Added dynamic config
  private readonly selectors: any; // Changed from typeof config.selectors.cart

  constructor(page: Page) {
    this.page = page;
    this.config = loadConfig(); // Load config dynamically
    this.selectors = this.config.selectors.cart;
  }

  async navigateToCartViaIcon(): Promise<void> {
    await this.page.locator(this.selectors.carticon).click();

    await this.page.waitForURL(
      `${this.config.baseURL}${this.config.paths.cart}`
    );
  }

  async proceedToCheckout(): Promise<void> {
    await assertVisible(this.page, this.selectors.proceedToCheckoutButton);
    const btn = this.page.locator(this.selectors.proceedToCheckoutButton);
    await btn.click();
    // Updated config reference
    await this.page.waitForURL(
      `${this.config.baseURL}${this.config.paths.checkout}`
    );
  }

  async getCartTotal(): Promise<string> {
    return (
      (await this.page.locator(this.selectors.cartTotal).textContent()) ?? ""
    );
  }

  async emptyCart(): Promise<void> {
    const removeButtons = await this.page
      .locator(this.selectors.removeItemButton)
      .all();

    for (const button of removeButtons.reverse()) {
      await button.click();
    }

    await expect(
      this.page.getByRole(this.selectors.emptyCartMessage.role as "heading", {
        name: this.selectors.emptyCartMessage.name,
      })
    ).toBeVisible();
  }

  async getCartItemCount(): Promise<number> {
    return await this.page.locator(this.selectors.cartItemTitle).count();
  }

  // not yet in use
  async verifyCart(): Promise<void> {
    await this.page.waitForURL(
      `${this.config.baseURL}${this.config.paths.cart}`
    );
    // Updated config reference
    await expect(this.page.locator(this.selectors.cartTotal)).toContainText(
      this.config.products.defaultProduct.options.expectedPrice
    );
  }
}
