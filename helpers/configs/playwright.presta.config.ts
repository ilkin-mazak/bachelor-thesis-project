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
      name: "presta-chromium",
      use: {
        browserName: "chromium",
        baseURL: "http://localhost:8080",
      },
    },
    {
      name: "presta-firefox",
      use: {
        browserName: "firefox",
        baseURL: "http://localhost:8080",
      },
    },
    {
      name: "presta-webkit",
      use: {
        browserName: "webkit",
        baseURL: "http://localhost:8080",
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
