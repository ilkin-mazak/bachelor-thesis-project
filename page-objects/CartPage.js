import config from "../config/site-config.json" assert { type: "json" };

export default class CartPage {
  constructor(page) {
    this.page = page;
    this.selectors = config.selectors.cart;
  }

  async proceedToCheckout() {
    await this.page.locator(this.selectors.proceedToCheckout).click();
  }

  async getCartTotal() {
    return await this.page.locator(this.selectors.cartTotal).textContent();
  }

  async emptyCart() {
    const removeButtons = await this.page
      .locator(this.selectors.removeItemButton)
      .all();

    // Remove items from last to first to avoid DOM changes affecting indexes
    for (let i = removeButtons.length - 1; i >= 0; i--) {
      await removeButtons[i].click();
      await this.page.waitForTimeout(1000); // Increased timeout for stability
      await this.page.waitForLoadState("networkidle");
    }
  }

  async getCartItemCount() {
    return await this.page.locator(".wc-block-components-product-name").count();
  }
}
