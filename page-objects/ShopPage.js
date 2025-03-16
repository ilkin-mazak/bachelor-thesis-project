import config from "../config/site-config.json" assert { type: "json" };

export default class ShopPage {
  constructor(page) {
    this.page = page;
    this.selectors = config.selectors.product; // Only product selectors
  }

  async navigateToProduct(productSlug) {
    await this.page.goto(`/product/${productSlug}`);
    await this.page.waitForSelector(this.selectors.sizeDropdown);
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
