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

   async navigateToCartViaIcon(): Promise<void> {

    await this.page.locator(this.selectors.carticon).click();
    
    await this.page.waitForURL(
      `${config.baseURL}${config.paths.cart}`
    );
  }

   async proceedToCheckout(): Promise<void> {
    await assertVisible(this.page, this.selectors.proceedToCheckoutButton);

    const btn = this.page.locator(this.selectors.proceedToCheckoutButton);  
    await expect(btn).toBeVisible();
  
    await btn.click();
    
    await this.page.waitForURL(`${config.baseURL}${config.paths.checkout}`);

    await this.page.waitForLoadState('domcontentloaded'); //optional validation
  }
 

   async getCartTotal(): Promise<string> {
     return (
       (await this.page.locator(this.selectors.cartTotal).textContent()) ?? ""
     );
   }
 

  async emptyCart(): Promise<void> {
    const removeButtons = await this.page
      .locator(this.selectors.removeItemButton)
      .all();
  
    for (const button of removeButtons.reverse()) {
      await button.click();  
    }
    
    await expect(
      this.page.getByRole(
        this.selectors.emptyCartMessage.role as "heading",
        { name: this.selectors.emptyCartMessage.name }
      )
    ).toBeVisible();
  }
 

async getCartItemCount(): Promise<number> {
  return await this.page.locator(this.selectors.cartItemTitle).count();
}


// not yet in use
async verifyCart(): Promise<void> {

  await this.page.waitForURL(
    `${config.baseURL}${config.paths.cart}`
  );
  await expect(this.page.locator(config.selectors.cart.cartTotal)).toContainText(
  config.products.defaultProduct.options.expectedPrice
);
}

}


