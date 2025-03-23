//CartPage.ts
import { Page, Locator, expect } from "@playwright/test";
 import config from "../config/site-config.json" with { type: "json" };
 import { assertVisible } from '../helpers.js';
 export default class CartPage {
   private readonly page: Page;
   private readonly selectors: typeof config.selectors.cart;
 
   constructor(page: Page) {
     this.page = page;
     this.selectors = config.selectors.cart;
   }
 
   async proceedToCheckout(): Promise<void> {
    await assertVisible(this.page, this.selectors.proceedToCheckout);

    const btn = this.page.locator(this.selectors.proceedToCheckout);
    
    // Use soft assertion for visibility
    await expect(btn).toBeVisible();
  
    await btn.click();
    
    // Use Playwright's built-in URL wait
    await this.page.waitForURL(`${config.baseURL}${config.paths.checkout}`);

    await this.page.waitForLoadState('domcontentloaded');
  }
 
   async getCartTotal(): Promise<string> {
     return (
       (await this.page.locator(this.selectors.cartTotal).textContent()) ?? ""
     );
   }
 
  //  async emptyCart(): Promise<void> {
  //    const removeButtons: Locator[] = await this.page
  //      .locator(this.selectors.removeItemButton)
  //      .all();
 
  //    for (let i = removeButtons.length - 1; i >= 0; i--) {
  //      await removeButtons[i].click();
  //      await this.page.waitForSelector(this.selectors.removeItemButton, {
  //        state: "detached",
  //        timeout: 5000,
  //      });
  //    }
  //  }

  // CartPage.ts - Stabilize cart clearing
  async emptyCart(): Promise<void> {
    const removeButtons = await this.page
      .locator(this.selectors.removeItemButton)
      .all();
  
    for (const button of removeButtons.reverse()) {
      await button.click();
      
      // // Use config-based notification selector
      // await expect(
      //   this.page.locator(config.selectors.cart.removalNotification)
      // ).toContainText('Your cart is currently empty!', { timeout: 8000 });
    }
    
    // Use proper role-based assertion
    await expect(
      this.page.getByRole(
        this.selectors.emptyCartMessage.role as "heading",
        { name: this.selectors.emptyCartMessage.name }
      )
    ).toBeVisible();
  }
 

   async getCartItemCount(): Promise<number> {
     return await this.page.locator(".wc-block-components-product-name").count();
   }
 }