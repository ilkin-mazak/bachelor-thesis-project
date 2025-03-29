//CheckoutFlow.spec.ts
import { test, expect } from "@playwright/test";
import LoginPage from "../page-objects/LoginPage.js";
import ShopPage from "../page-objects/ShopPage.js";
import CartPage from "../page-objects/CartPage.js";
import CheckoutPage from "../page-objects/CheckoutPage.js";
import config from "../config/site-config.json" with { type: "json" };


test.describe("E2E Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {

    // 1. Login
    const loginPage = new LoginPage(page);
    await loginPage.navigateToAccountLogin();
    await loginPage.login(
      config.users.valid.username,
      config.users.valid.password
    );

    // 2. Clear cart while authenticated
    const cartPage = new CartPage(page);  
    await page.goto(`${config.baseURL}${config.paths.cart}`);

    // Only empty if items exist
    if ((await cartPage.getCartItemCount()) > 0) {
      await cartPage.emptyCart();
    }
  });

  test("Complete checkout as logged-in user", async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Add Product to Cart
    await shopPage.navigateToProduct(config.products.defaultProduct.title);
    await shopPage.selectProductOptions(
      config.products.defaultProduct.options.size,
      config.products.defaultProduct.options.color
    );
    await shopPage.addToCart();

    // 2. View and Verify Cart
    await shopPage.viewCart();
    await expect(page.locator(config.selectors.cart.cartTotal)).toContainText(
      config.products.defaultProduct.options.expectedPrice
    );

    // 3. Proceed to Checkout and complete
    await cartPage.proceedToCheckout();
    await checkoutPage.clickEditAddress();
    await checkoutPage.fillShippingDetails(config.testData.shippingDetails);
    await checkoutPage.placeOrder();
    
 // 4. Assert  
 await checkoutPage.verifyOrderConfirmation();

}); 
});