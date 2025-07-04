import { Page, expect } from "@playwright/test";
import { loadConfig } from "../helpers/config-loader.js";

export default class CartPage {
  private readonly page: Page;
  public readonly config: ReturnType<typeof loadConfig>;
  private readonly selectors: any;

  constructor(page: Page) {
    this.page = page;
    this.config = loadConfig();
    this.selectors = this.config.selectors.cart;
  }

  async navigateToCartViaIcon(): Promise<void> {
    await this.page.locator(this.selectors.carticon).click();

    await this.page.waitForURL(
      new RegExp(`${this.config.baseURL}${this.config.paths.cart}`)
    );
  }

  async goToCart(): Promise<void> {
    await this.page.goto(`${this.config.baseURL}${this.config.paths.cart}`, {
      waitUntil: "networkidle",
    });
  }

  async proceedToCheckout(): Promise<void> {
    console.log("Waiting for proceed to checkout button...");
    const btn = this.page.locator(this.selectors.proceedToCheckoutButton);
    await btn.waitFor({ state: "visible" });
    await btn.click({ force: true, noWaitAfter: true });
    await btn.waitFor({ state: "detached", timeout: 5000 });
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
    // assert empty cart message
    await expect(
      this.page.getByRole(this.selectors.emptyCartMessage.role as "heading", {
        name: this.selectors.emptyCartMessage.name,
      })
    ).toBeVisible();
  }

  async getCartItemCount(): Promise<number> {
    if (this.config.platform === "prestashop") {
      // Wait for cart items to be loaded for Prestashop
      await this.page.waitForSelector(this.selectors.cartItemTitle, {
        state: "attached",
        timeout: 5000,
      });
      const itemCount = await this.page
        .locator(this.selectors.cartItemTitle)
        .count();
      return itemCount;
    } else {
      // handle loading states for WooCommerce
      try {
        await this.page.waitForSelector(this.selectors.cartItemTitle, {
          state: "attached",
          timeout: 5000,
        });
        return await this.page.locator(this.selectors.cartItemTitle).count();
      } catch (e) {
        // if no items found, return 0 instead of throwing error
        return 0;
      }
    }
  }

  async verifyCartTotal(): Promise<void> {
    //assert the cart URL
    await this.page.waitForURL(
      new RegExp(`${this.config.baseURL}${this.config.paths.cart}`)
    );

    //assert the cart total price is as expected
    if (this.config.platform === "woocommerce") {
      await expect(this.page.locator(this.selectors.cartTotal)).toContainText(
        this.config.products.defaultProduct.options.expectedPrice
      );
    }
  }
}
