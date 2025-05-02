//ShopPage.ts
import { Page, expect } from "@playwright/test";
import { loadConfig } from "../helpers/config-loader.js";

export default class ShopPage {
  private readonly page: Page;
  public readonly config: ReturnType<typeof loadConfig>; // Added dynamic config
  private readonly selectors: any; // Changed from typeof config.selectors.product

  constructor(page: Page) {
    this.page = page;
    this.config = loadConfig();
    this.selectors = this.config.selectors.product;
  }

  // async navigateToProduct(productTitle: string): Promise<void> {
  //   // Updated config references
  //   await this.page.goto(
  //     `${this.config.baseURL}${this.config.paths.product}${productTitle}`,
  //     { waitUntil: "networkidle" }
  //   );
  //   await this.page.locator(this.selectors.sizeDropdown).waitFor();
  // }
  async navigateToProduct(productTitle: string): Promise<void> {
    const isPresta = this.config.baseURL.includes("prestashop");

    // Construct platform-specific product URL
    const productUrl = isPresta
      ? `${this.config.baseURL}${this.config.paths.product}${productTitle}.html`
      : `${this.config.baseURL}${this.config.paths.product}${productTitle}/`;

    await this.page.goto(productUrl, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    // Platform-agnostic wait logic
    await Promise.race([
      this.page.locator(this.selectors.sizeDropdown).waitFor(),
      this.page.locator(this.selectors.colorDropdown).waitFor(),
      this.page
        .locator(this.selectors.addToCartButton)
        .waitFor({ state: "visible" }),
    ]);
  }

  // async selectProductOptions(size: string, color: string): Promise<void> {
  //   await this.page.locator(this.selectors.sizeDropdown).selectOption(size);
  //   await this.page.locator(this.selectors.colorDropdown).selectOption(color);
  // }
  async selectProductOptions(size: string, color: string): Promise<void> {
    // Handle size dropdown for both platforms
    await this.page.locator(this.selectors.sizeDropdown).selectOption(size);

    // Platform-specific color handling
    if (this.config.platform === "prestashop") {
      // PrestaShop color radio button
      const colorSelector = this.selectors.colorDropdown.replace(
        "{color}",
        color
      );
      await this.page.locator(colorSelector).click({ force: true });
    } else {
      // WooCommerce dropdown
      await this.page.locator(this.selectors.colorDropdown).selectOption(color);
    }
  }

  // async addToCart(): Promise<void> {
  //   await this.page.locator(this.selectors.addToCartButton).click();
  //   await this.page.waitForSelector(this.selectors.viewCartButton);
  // }
  async addToCart(): Promise<void> {
    await this.page.locator(this.selectors.addToCartButton).click();

    if (this.config.platform === "prestashop") {
      // Handle PrestaShop modal
      await this.page.waitForSelector(this.selectors.modal.proceedToCheckout);
      await this.page.locator(this.selectors.modal.proceedToCheckout).click();

      // Wait for cart page load
      // await this.page.waitForURL(
      //   `${this.config.baseURL}${this.config.paths.cart}`
      // );
    } else {
      // WooCommerce handling
      await this.page.waitForSelector(this.selectors.viewCartButton);
      await this.page.locator(this.selectors.viewCartButton).click();
    }
  }
  async viewCart(): Promise<void> {
    await this.page.waitForURL(
      `${this.config.baseURL}${this.config.paths.cart}`,
      {
        timeout: 30000,
        waitUntil: "load",
      }
    );
  }
}
