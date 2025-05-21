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

  // add product to cart while logged out
  await shopPage.navigateToProduct(config.products.defaultProduct.title);

  await shopPage.selectProductOptions(
    config.products.defaultProduct.options.size,
    config.products.defaultProduct.options.color
  );
  await shopPage.addToCart();

  // go to cart and assert the total price
  await cartPage.goToCart();
  await cartPage.verifyCartTotal();

  // log in
  await loginPage.navigateToAccountLogin();

  await loginPage.login(
    config.users.valid.username,
    config.users.valid.password
  );
  await loginPage.assertSuccessfulLogin();

  // assert item exists in cart after login
  if (config.platform === "prestashop") {
    await cartPage.navigateToCartViaIcon();
  } else {
    await cartPage.goToCart();
  }
  await cartPage.verifyCartTotal();
});
