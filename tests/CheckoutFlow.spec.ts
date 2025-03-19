//CheckoutFlow.spec.ts
import { test, expect } from "@playwright/test";
import LoginPage from "../page-objects/LoginPage.js";
import ShopPage from "../page-objects/ShopPage.js";
import CartPage from "../page-objects/CartPage.js";
import CheckoutPage from "../page-objects/CheckoutPage.js";
import config from "../config/site-config.json" with { type: "json" };

test.describe("E2E Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    // 1. Login first
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    await loginPage.login(
      config.users.valid.username,
      config.users.valid.password
    );

    // 2. Clear cart while authenticated
    const cartPage = new CartPage(page);
    await page.goto("/cart");

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
    await shopPage.navigateToProduct(config.products.defaultProduct.slug);
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

    // 3. Proceed to Checkout
    await cartPage.proceedToCheckout();

    // 4. Complete Checkout
    await page.waitForURL(/checkout/); // Wait for checkout page to load

    await checkoutPage.safeClickEditAddress();

    await checkoutPage.ensureBillingFormVisible();
    await checkoutPage.fillShippingDetails(config.testData.shippingDetails);
    await checkoutPage.placeOrder();

    // Firefox-specific stabilization
    if ((await page.context().browser()?.browserType().name()) === "firefox") {
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1000); // Allow final render
    }

    // 5. Final Assertions
  //   await expect(
  //     page.getByRole("heading", { name: "Order received" })
  //   ).toBeVisible({ timeout: 10000 }); // Wait up to 10 seconds
  //   await expect(page).toHaveURL(/order-received/);
  //   await expect(
  //     page.getByRole(
  //       config.selectors.checkout.orderReceivedHeading.role as "heading", 
  //       { name: config.selectors.checkout.orderReceivedHeading.name }
  //     )
  //   ).toBeVisible();
    
  // });


  // Replace the final assertion block with:
const isFirefox = (await page.context().browser()?.browserType().name()) === 'firefox';

await expect(
  page.getByRole('heading', { name: 'Order received' })
).toBeVisible({ 
  timeout: isFirefox ? 25000 : 15000 // Extended timeout for Firefox
});

// Firefox-specific stabilization
if (isFirefox) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready); // Wait for fonts
}
  
}); 
});