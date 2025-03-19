import { Page, Locator } from "@playwright/test";
import config from "../config/site-config.json" with { type: "json" };

export default class CartPage {
  private readonly page: Page;
  private readonly selectors: typeof config.selectors.cart;

  constructor(page: Page) {
    this.page = page;
    this.selectors = config.selectors.cart;
  }

  async proceedToCheckout(): Promise<void> {
    const btn: Locator = this.page.locator(this.selectors.proceedToCheckout);

    await btn.waitFor({ state: "visible", timeout: 15000 });
    await btn.hover();

    const [navigation] = await Promise.all([
      this.page.waitForNavigation({
        url: /checkout/,
        waitUntil: "commit",
        timeout: 30000,
      }),
      btn.click(),
    ]);

    if (navigation) {
      await navigation.finished().catch(() => {});
    }
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });
  }

  async getCartTotal(): Promise<string> {
    return (
      (await this.page.locator(this.selectors.cartTotal).textContent()) ?? ""
    );
  }

  async emptyCart(): Promise<void> {
    const removeButtons: Locator[] = await this.page
      .locator(this.selectors.removeItemButton)
      .all();

    for (let i = removeButtons.length - 1; i >= 0; i--) {
      await removeButtons[i].click();
      await this.page.waitForSelector(this.selectors.removeItemButton, {
        state: "detached",
        timeout: 5000,
      });
    }
  }

  async getCartItemCount(): Promise<number> {
    return await this.page.locator(".wc-block-components-product-name").count();
  }
}
