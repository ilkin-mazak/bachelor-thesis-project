import config from "../config/site-config.json" assert { type: "json" };

export default class ShopPage {
  constructor(page) {
    this.page = page;
    this.selectors = config.selectors.product; // Only product selectors
  }

  // async navigateToProduct(productSlug) {
  //   await this.page.goto(`/product/${productSlug}`);
  //   await this.page.waitForSelector(this.selectors.sizeDropdown);
  // }

  async navigateToProduct(productSlug) {
    // 1. Use full URL with base from config
    await this.page.goto(`${config.baseURL}/product/${productSlug}`);

    // 2. Wait for ALL network requests to finish
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });

    // 3. Wait for size dropdown to exist in DOM (even if hidden)
    await this.page.waitForSelector(this.selectors.sizeDropdown, {
      state: "attached",
      timeout: 20000,
    });

    // 4. Wait for JavaScript rendering complete
    await this.page.evaluate(async () => {
      await new Promise((resolve) => {
        if (document.readyState === "complete") resolve();
        document.addEventListener("readystatechange", () => {
          if (document.readyState === "complete") resolve();
        });
      });
    });

    // 5. Final visibility check
    await this.page.waitForSelector(this.selectors.sizeDropdown, {
      state: "visible",
      timeout: 10000,
    });
  }

  async selectProductOptions(size, color) {
    await this.page.locator(this.selectors.sizeDropdown).selectOption(size);
    await this.page.locator(this.selectors.colorDropdown).selectOption(color);
  }

  async addToCart() {
    await this.page.locator(this.selectors.addToCartButton).click();
    await this.page.waitForSelector(this.selectors.viewCartButton);
  }

  async viewCart() {
    await this.page.locator(this.selectors.viewCartButton).click();
    await this.page.waitForURL(/cart/);
  }
}
