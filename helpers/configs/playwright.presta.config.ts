// helpers/configs/playwright.presta.config.ts
import { defineConfig } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: path.join(__dirname, "../../tests"),
  testMatch: "**/*.spec.ts",
  workers: 1,
  use: {
    headless: false,
    baseURL: "http://localhost:8080",
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
});
