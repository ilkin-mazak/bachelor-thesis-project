//playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
//import config from "./config/site-config.json" with { type: "json" };

import { loadConfig } from "./helpers/config-loader.js";
const config = loadConfig();
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // setup: async ({ browser }) => {
  //   const page = await browser.newPage();
  //   await maximizeBrowserWindow(page);
  // },

  timeout: 20000,
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 1,
  /* Opt out of parallel tests on CI. */
  //workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    [
      "allure-playwright",
      {
        outputFolder: "allure-results", // Raw report data
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: "http://mystore.local", // Default to WooCommerce; overridden via script
    headless: false,
    actionTimeout: 20000,
    navigationTimeout: 20000,
    serviceWorkers: "block",
    bypassCSP: true,

    launchOptions: {
      args: ["--start-maximized"],
    },
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "woocommerce",
      use: {
        browserName: "chromium",
        baseURL: "http://mystore.local",
      },
    },
    {
      name: "prestashop",
      use: {
        browserName: "chromium",
        baseURL: "http://localhost:8080",
      },
    },
    {
      name: "chromium",
      use: {
        //...devices["Desktop Chrome"],
        navigationTimeout: 20000,
        viewport: null,
      },
    },

    // {
    //   name: "firefox",
    //   use: {
    //     browserName: "firefox",
    //     //...devices["Desktop Firefox"],
    //     navigationTimeout: 20000,
    //     viewport: null,
    //   },
    // },

    // {
    //   name: "webkit",
    //   use: {
    //     browserName: "webkit",
    //     //...devices["Desktop Safari"],
    //     navigationTimeout: 20000,
    //     viewport: null,
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
