import { test, expect } from "@playwright/test";
import LoginPage from "../page-objects/LoginPage.js";
import ShopPage from "../page-objects/ShopPage.js";
import CartPage from "../page-objects/CartPage.js";
import { loadConfig } from "../helpers/config-loader.js";

test("Cart persists after login", async ({ page }) => {
  const config = loadConfig();
  const shopPage = new ShopPage(page);
  const cartPage = new CartPage(page);
  const loginPage = new LoginPage(page);

  // 1. Add product to cart while logged out
  await shopPage.navigateToProduct(config.products.defaultProduct.title);
  await shopPage.selectProductOptions(
    config.products.defaultProduct.options.size,
    config.products.defaultProduct.options.color
  );
  await shopPage.addToCart();

  // 2. Go to cart and verify item is present
  if (config.platform === "prestashop") {
    await page.goto(`${cartPage.config.baseURL}${cartPage.config.paths.cart}`);
    await cartPage.verifyCart();
  } else {
    await shopPage.viewCart();
    await cartPage.verifyCart();
  }

  // 3. Log in
  await loginPage.navigateToAccountLogin();
  await loginPage.login(
    config.users.valid.username,
    config.users.valid.password
  );
  await loginPage.assertSuccessfulLogin();

  // 4. Assert item exist in cart after login
  await shopPage.viewCart();
  await cartPage.verifyCart();

});