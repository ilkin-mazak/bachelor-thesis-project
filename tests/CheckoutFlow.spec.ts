//CheckoutFlow.spec.ts
import { test, expect } from "@playwright/test";
import LoginPage from "../page-objects/LoginPage.js";
import ShopPage from "../page-objects/ShopPage.js";
import CartPage from "../page-objects/CartPage.js";
import CheckoutPage from "../page-objects/CheckoutPage.js";

test.describe("E2E Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Login
    const loginPage = new LoginPage(page);
    await loginPage.navigateToAccountLogin();
    await loginPage.login(
      loginPage.config.users.valid.username,
      loginPage.config.users.valid.password
    );

    // 2. Clear cart while authenticated
    const cartPage = new CartPage(page);
    await page.goto(`${cartPage.config.baseURL}${cartPage.config.paths.cart}`);

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
    await shopPage.navigateToProduct(
      shopPage.config.products.defaultProduct.title
    );
    await shopPage.selectProductOptions(
      shopPage.config.products.defaultProduct.options.size,
      shopPage.config.products.defaultProduct.options.color
    );
    await shopPage.addToCart();

    // 2. View and Verify Cart
    await shopPage.viewCart();
    await expect(
      page.locator(cartPage.config.selectors.cart.cartTotal as string)
    ).toContainText(
      shopPage.config.products.defaultProduct.options.expectedPrice
    );

    // 3. Proceed to Checkout and complete
    await cartPage.proceedToCheckout();
    await checkoutPage.clickEditAddress();
    await checkoutPage.fillShippingDetails(
      checkoutPage.config.testData.shippingDetails
    );
    await checkoutPage.placeOrder();

    // 4. Assert
    await checkoutPage.verifyOrderConfirmation();
  });
});
