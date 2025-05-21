import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type SelectorObject = {
  role?: string;
  name?: string;
  [key: string]: unknown;
};

interface SiteConfig {
  platform: "prestashop" | "woocommerce";
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

  // validate environment variable
  if (!process.env.TEST_SITE) {
    throw new Error(
      "TEST_SITE environment variable must be set! " +
        'Use: "woocommerce" or "prestashop"'
    );
  }

  // whitelist and normalize
  const allowedSites = ["woocommerce", "prestashop"] as const;
  const site =
    process.env.TEST_SITE.toLowerCase() as (typeof allowedSites)[number];

  if (!allowedSites.includes(site)) {
    throw new Error(
      `Invalid TEST_SITE value: "${site}". ` +
        `Allowed values: ${allowedSites.join(", ")}`
    );
  }

  // assert that config file exists
  const configPath = resolve(__dirname, `../config/sites/${site}.json`);
  if (!existsSync(configPath)) {
    // if not, throw explanatory error
    throw new Error(
      `Config file not found for ${site} at: ${configPath}\n` +
        "Verify the file exists in config/sites directory"
    );
  }

  // 4. parse the config
  try {
    const rawData = readFileSync(configPath, "utf-8");
    const jsonConfig = JSON.parse(rawData) as SiteConfig;

    return {
      ...jsonConfig,
      platform: site,
    };
  } catch (error) {
    throw new Error(
      `Failed to load ${site} config: ${
        error instanceof Error ? error.message : "Unknown error"
      }\nFile path: ${configPath}`
    );
  }
}
