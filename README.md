# Cross-Browser UI Testing Framework

A local-first, config-driven UI testing framework for e-commerce platforms. Built with Playwright and TypeScript, it enables reusable, cross-browser test automation without relying on cloud tools.

## 🚀 Features

* Cross-browser: Chromium, Firefox, WebKit
* Platform-agnostic via JSON configs
* Fully local: No external services required
* Page Object Model architecture
* Allure reporting for test results
* Predefined test flows (login, checkout)

## 🔧 Installation

```bash
git clone https://github.com/ilkin-mazak/bachelor-final-project
cd bachelor-final-project
npm install
npx playwright install
```

## ⚙️ Setup Platform Environments

* **WooCommerce**: Start with [Local](https://localwp.com/) and import the provided demo site ([http://mystore.local](http://mystore.local)).
* **PrestaShop**: Use Docker with the included `docker-compose.yml` ([http://localhost:8080](http://localhost:8080)).

Set the platform via npm scripts (no manual config needed).

## 🧪 Run Tests

### Login Test

```bash
npm run test:login       # Both platforms
npm run test:login:woo   # WooCommerce only
npm run test:login:presta # PrestaShop only
```

### Checkout Flow

```bash
npm run test:woo         # WooCommerce checkout
npm run test:presta      # PrestaShop checkout
```

### Cross-Browser Parallel Test

```bash
npm run test:parallel:woo
npm run test:parallel:presta
```

> ⚠️ Recommended: 16GB+ RAM for parallel testing.

## 📊 View Test Results

```bash
npm run report
```

Opens an Allure dashboard with pass/fail rates, steps, and logs.

## 🧩 Project Structure

```
├── config/sites/        # JSON configs per platform
├── helpers/             # Config loader and utils
├── page-objects/        # POM classes
├── tests/               # .spec.ts test files
```

## 💡 Tips & Troubleshooting

* Always start local platforms before testing
* If tests are flaky in Firefox: `--repeat-each=2`
* Validate JSON config files if loading fails
* Use `TEST_SITE` env var only via npm scripts

