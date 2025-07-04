import { defineConfig } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: path.join(__dirname, "../../tests"),
  testMatch: "**/*.spec.ts",
  workers: 1,
  timeout: 20000,
  use: {
    headless: false,
    baseURL: "http://mystore.local",
    browserName: "chromium",
  },
  projects: [
    {
      name: "woo-chromium",
      use: {
        browserName: "chromium",
        baseURL: "http://mystore.local",
      },
    },
    {
      name: "woo-firefox",
      use: {
        browserName: "firefox",
        baseURL: "http://mystore.local",
      },
    },
    {
      name: "woo-webkit",
      use: {
        browserName: "webkit",
        baseURL: "http://mystore.local",
      },
    },
  ],
  reporter: [
    ["list"],
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        detail: false,
        suiteTitle: false,
      },
    ],
  ],
});
