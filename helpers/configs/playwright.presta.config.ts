// helpers/configs/playwright.presta.config.ts
import { defineConfig } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: path.join(__dirname, "../../tests"), // Correct path
  testMatch: "**/*.spec.ts",
  use: {
    headless: false,
    baseURL: "http://localhost:8080",
    browserName: "chromium",
  },
});
