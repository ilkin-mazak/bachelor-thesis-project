//ShopPage.ts
import { Page } from "@playwright/test";
import config from "../config/site-config.json" with { type: "json" };

export default class ShopPage {
  private readonly page: Page;
  private readonly selectors: typeof config.selectors.product;

  constructor(page: Page) {
    this.page = page;
    this.selectors = config.selectors.product;
  }

  async navigateToProduct(productTitle: string): Promise<void> {
    await this.page.goto(`${config.baseURL}${config.paths.product}${productTitle}`, {
      waitUntil: "networkidle"
        });

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
    await this.page.waitForURL(`${config.baseURL}${config.paths.cart}`);
  }
}
