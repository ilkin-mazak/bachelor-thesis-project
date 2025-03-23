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

  async navigateToProduct(productSlug: string): Promise<void> {
    await this.page.goto(
      `${config.baseURL}${config.paths.product}/${productSlug}`
    );
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });

    await this.page.waitForSelector(this.selectors.sizeDropdown, {
      state: "attached",
      timeout: 20000,
    });

    await this.page.evaluate(async () => {
      await new Promise((resolve) => {
        if (document.readyState === "complete") resolve(undefined);
        document.addEventListener("readystatechange", () => {
          if (document.readyState === "complete") resolve(undefined);
        });
      });
    });

    await this.page.waitForSelector(this.selectors.sizeDropdown, {
      state: "visible",
      timeout: 10000,
    });
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
    await this.page.waitForURL(/cart/);
  }
}
