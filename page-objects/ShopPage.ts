//ShopPage.ts
import { Page, expect } from "@playwright/test";
import { loadConfig } from "../helpers/config-loader.js"; // Changed import

export default class ShopPage {
  private readonly page: Page;
  public readonly config: ReturnType<typeof loadConfig>; // Added dynamic config
  private readonly selectors: any; // Changed from typeof config.selectors.product

  constructor(page: Page) {
    this.page = page;
    this.config = loadConfig(); // Load config dynamically
    this.selectors = this.config.selectors.product; // Updated reference
  }

  async navigateToProduct(productTitle: string): Promise<void> {
    // Updated config references
    await this.page.goto(
      `${this.config.baseURL}${this.config.paths.product}${productTitle}`,
      { waitUntil: "networkidle" }
    );
    await this.page.locator(this.selectors.sizeDropdown).waitFor();
  }

  async selectProductOptions(size: string, color: string): Promise<void> {
    await this.page.locator(this.selectors.sizeDropdown).selectOption(size);
    await this.page.locator(this.selectors.colorDropdown).selectOption(color);
  }

  async addToCart(): Promise<void> {
    await this.page.locator(this.selectors.addToCartButton).click();
    await this.page.waitForSelector(this.selectors.viewCartButton);
  }

  async viewCart(): Promise<void> {
    await this.page.locator(this.selectors.viewCartButton).click();
    // Updated config reference
    await this.page.waitForURL(
      `${this.config.baseURL}${this.config.paths.cart}`
    );
  }
}
