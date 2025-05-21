//ShopPage.ts
import { Page } from "@playwright/test";
import { loadConfig } from "../helpers/config-loader.js";

export default class ShopPage {
  private readonly page: Page;
  public readonly config: ReturnType<typeof loadConfig>;
  private readonly selectors: any;

  constructor(page: Page) {
    this.page = page;
    this.config = loadConfig();
    this.selectors = this.config.selectors.product;
  }

  async navigateToProduct(productTitle: string): Promise<void> {
    const isPresta = this.config.baseURL.includes("prestashop");

    // Platform-specific product URL
    const productUrl = isPresta
      ? `${this.config.baseURL}${this.config.paths.product}${productTitle}.html`
      : `${this.config.baseURL}${this.config.paths.product}${productTitle}/`;

    await this.page.goto(productUrl, {
      waitUntil: "networkidle",
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

  async selectProductOptions(size: string, color: string): Promise<void> {

    await this.page.locator(this.selectors.sizeDropdown).selectOption(size);
    
    // Platform-specific color handling
    if (this.config.platform === "prestashop") {
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

  async addToCart(): Promise<void> {
    await this.page.locator(this.selectors.addToCartButton).click();

    if (this.config.platform === "prestashop") {
      // Handle PrestaShop modal
      await this.page.waitForSelector(this.selectors.modal.proceedToCheckout);
      await this.page.locator(this.selectors.modal.proceedToCheckout).click();
    }
  }

  // async viewCart(): Promise<void> {
  //   const btn = await this.page.waitForSelector(this.selectors.viewCartButton, {
  //     state: "visible",
  //   });
  //   await btn.click({ noWaitAfter: true });
  //   // await this.page.waitForSelector(this.selectors.viewCartButton, {
  //   //   state: "detached",
  //   // });
  // }

  async viewCart(): Promise<void> {
    await this.page.goto(`${this.config.baseURL}${this.config.paths.cart}`, {
      waitUntil: "networkidle"
    });
  }

  // async viewCart(): Promise<void> {
  //   await this.page.locator(this.selectors.viewCartButton).click();
  //   // Updated config reference
  //   // await this.page.waitForURL(
  //   //   `${this.config.baseURL}${this.config.paths.cart}`
  //   // );
  // }

  // async viewCart(): Promise<void> {
  //   // 1) wait for the button to be visible
  //   const btn = this.page.locator(this.selectors.viewCartButton);
  //   await btn.waitFor({ state: "visible" });

  //   // 2) click + wait for navigation in one go
  //   await Promise.all([
  //     this.page.waitForNavigation({ waitUntil: "load" }), // or 'domcontentloaded'
  //     btn.click(),
  //   ]);
  // }
}
