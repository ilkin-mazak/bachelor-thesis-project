import config from "../config/site-config.json" assert { type: "json" };

export default class CartPage {
  constructor(page) {
    this.page = page;
    this.selectors = config.selectors.cart;
  }

  // async proceedToCheckout() {
  //   await this.page.locator(this.selectors.proceedToCheckout).click();
  // }

  async proceedToCheckout() {
    const btn = this.page.locator(this.selectors.proceedToCheckout);

    // 1. Ensure button is actionable
    await btn.waitFor({ state: "visible", timeout: 15000 });
    await btn.hover(); // Simulate real user behavior

    // 2. Click with navigation promise
    const [navigation] = await Promise.all([
      this.page.waitForNavigation({
        url: /checkout/,
        waitUntil: "commit", // Critical change
        timeout: 30000,
      }),
      btn.click(),
    ]);

    // 3. Wait for final load state
    await navigation.finished().catch(() => {});
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });
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
      // Wait for the cart item to disappear
      await this.page.waitForSelector(this.selectors.removeItemButton, {
        state: "detached", // Waits until the element is removed from DOM
        timeout: 5000, // 5 seconds max
      });
    }
  }

  async getCartItemCount() {
    return await this.page.locator(".wc-block-components-product-name").count();
  }
}
