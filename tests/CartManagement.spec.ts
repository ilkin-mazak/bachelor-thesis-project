import { test, expect } from "@playwright/test";
import LoginPage from "../page-objects/LoginPage.js";
import config from "../config/site-config.json" with { type: "json" };
import ShopPage from "../page-objects/ShopPage.js";
import CartPage from "../page-objects/CartPage.js";
import CheckoutPage from "../page-objects/CheckoutPage.js";


test.describe("Cart Management", () => {
  test.beforeEach(async ({ page }) => {
    const shopPage = new ShopPage(page);
    await shopPage.navigateToProduct(config.products.defaultProduct.slug);
    await shopPage.selectProductOptions(
      config.products.defaultProduct.options.size,
      config.products.defaultProduct.options.color
    );
    await shopPage.addToCart();
    await shopPage.viewCart();
  });

  

  test("Remove items from cart", async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.emptyCart();
    await cartPage.assertEmptyCart();
  });

  test("Add multiple products to cart", async ({ page }) => {
  const shopPage = new ShopPage(page);
  const cartPage = new CartPage(page);

  // Add second product
  await shopPage.navigateToProduct(config.products.sweatshirt.slug);
  await shopPage.selectProductOptions(
    config.products.sweatshirt.options.size,
    config.products.sweatshirt.options.color
  );
  
  // Explicitly view cart after each addition
  await shopPage.addToCart();
  await shopPage.viewCart();  // Refresh cart state

  await cartPage.assertCartItemCount(2);
});
});
