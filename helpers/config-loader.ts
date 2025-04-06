// config-loader.ts
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type SelectorObject = {
  role?: string;
  name?: string;
  [key: string]: unknown;
};

interface SiteConfig {
  baseURL: string;
  paths: Record<string, string>;
  selectors: {
    login: Record<string, string | SelectorObject>;
    product: Record<string, string>;
    cart: Record<string, string | SelectorObject>;
    checkout: Record<string, string | SelectorObject | Record<string, string>>;
  };
  products: Record<
    string,
    {
      title: string;
      options: {
        size: string;
        color: string;
        expectedPrice: string;
      };
    }
  >;
  users: {
    valid: { username: string; password: string };
    invalid: { username: string; password: string };
  };
  errorMessages: {
    loginError: string;
  };
  testData: {
    shippingDetails: Record<string, string>;
  };
}

export function loadConfig(): SiteConfig {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // 1. Validate environment variable first
  if (!process.env.TEST_SITE) {
    throw new Error(
      "TEST_SITE environment variable must be set! " +
        'Use: "woocommerce" or "prestashop"'
    );
  }

  // 2. Whitelist allowed values
  const allowedSites = ["woocommerce", "prestashop"];
  const site = process.env.TEST_SITE.toLowerCase();
  if (!allowedSites.includes(site)) {
    throw new Error(
      `Invalid TEST_SITE value: "${site}". ` +
        `Allowed values: ${allowedSites.join(", ")}`
    );
  }

  // 3. Validate config file existence
  const configPath = resolve(__dirname, `../config/sites/${site}.json`);
  if (!existsSync(configPath)) {
    throw new Error(
      `Config file not found for ${site} at: ${configPath}\n` +
        "Verify the file exists in config/sites directory"
    );
  }

  // 4. Parse with error context
  try {
    const rawData = readFileSync(configPath, "utf-8");
    return JSON.parse(rawData) as SiteConfig;
  } catch (error) {
    throw new Error(
      `Failed to load ${site} config: ${
        error instanceof Error ? error.message : "Unknown error"
      }\n` + `File path: ${configPath}`
    );
  }
}
