//LoginPage.spec.ts
import { test, expect } from "@playwright/test";
import LoginPage from "../page-objects/LoginPage.js";
import config from "../config/site-config.json" with { type: "json" };
import ShopPage from "../page-objects/ShopPage.js";
import CartPage from "../page-objects/CartPage.js";
import CheckoutPage from "../page-objects/CheckoutPage.js";

test.describe("Authentication Scenarios", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies(); // Ensure clean state
  });

  test("Successful login with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToAccountLogin();
    await loginPage.fillCredentials(
      config.users.valid.username,
      config.users.valid.password
    );
    await loginPage.submitLogin();
    await loginPage.assertSuccessfulLogin();
  });

  test("Failed login with invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToAccountLogin();
    await loginPage.fillCredentials(
      config.users.invalid.username,
      config.users.invalid.password
    );
    await loginPage.submitLogin();
    await loginPage.assertLoginError();
  });

});
