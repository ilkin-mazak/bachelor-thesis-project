import { Page, Locator } from "@playwright/test";
import config from "../config/site-config.json" with { type: "json" };

export default class CheckoutPage {
  private readonly page: Page;
  private readonly selectors: typeof config.selectors.checkout; // Already points to checkout selectors

  constructor(page: Page) {
    this.page = page;
    this.selectors = config.selectors.checkout; // Contains all checkout selectors
  }

  async safeClickEditAddress(): Promise<void> {
    // 1. Wait for address container
    const addressContainer = this.page.locator(
      config.selectors.checkout.editShippingAddress.container
    );
    await addressContainer.waitFor({ state: "attached", timeout: 15000 });
  
    // 2. Direct CSS selector for button (no role/text matching)
    const editButton = addressContainer.locator(
      config.selectors.checkout.editShippingAddress.button
    );
  
    // 3. Wait for button with combined checks
    await editButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
  
    // 4. Click with form appearance guarantee
    await Promise.all([
      this.page.waitForSelector("#shipping-first_name", {
        state: "visible",
        timeout: 5000,
      }),
      editButton.click(),
    ]);
  }



  async ensureBillingFormVisible(): Promise<void> {
    await this.page.waitForFunction(
      () => {
        const form = document.querySelector("#shipping-first_name")as HTMLElement;
        return form && form.offsetParent !== null;
      },
      { timeout: 3000 }
    );
  }

  async fillShippingDetails(
    details: typeof config.testData.shippingDetails
  ): Promise<void> {
    await this.ensureBillingFormVisible();

    const fillWithRetry = async (
      selector: string,
      value: string
    ): Promise<void> => {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await this.page.locator(selector).fill(value, { timeout: 5000 });
          return;
        } catch (error) {
          if (attempt === 3) throw error;
          await this.page.waitForTimeout(1000 * attempt);
        }
      }
    };

    await this.page.locator(this.selectors.firstName).fill(details.firstName);
    await this.page.locator(this.selectors.lastName).fill(details.lastName);
    await this.page.locator(this.selectors.address).fill(details.address);
    await this.page.locator(this.selectors.city).fill(details.city);
    await fillWithRetry(this.selectors.postcode, details.postcode);
  }

  async placeOrder(): Promise<void> {
    await this.page.locator(this.selectors.placeOrderButton).click();
  }
}
