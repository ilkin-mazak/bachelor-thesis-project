import { test, expect } from "@playwright/test";
import LoginPage from "../page-objects/LoginPage.js";
import { loadConfig } from "../helpers/config-loader.js";

test.describe("Authentication Scenarios", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("Successful login with valid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const config = loadConfig();

    await loginPage.navigateToAccountLogin();

    await loginPage.login(
      config.users.valid.username,
      config.users.valid.password
    );
    await loginPage.assertSuccessfulLogin();
  });

  test("Failed login with invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const config = loadConfig();

    await loginPage.navigateToAccountLogin();

    await loginPage.login(
      config.users.invalid.username,
      config.users.invalid.password
    );
    await loginPage.assertLoginError();
  });
});
