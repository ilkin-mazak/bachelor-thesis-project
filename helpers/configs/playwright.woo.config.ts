// helpers/configs/playwright.woo.config.ts
import { defineConfig } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: path.join(__dirname, "../../tests"),
  testMatch: "**/*.spec.ts",
  use: {
    headless: false,
    baseURL: "http://mystore.local",
    browserName: "chromium",
  },
});
