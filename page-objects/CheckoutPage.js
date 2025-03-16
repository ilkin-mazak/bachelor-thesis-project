import config from "../config/site-config.json" assert { type: "json" };

export default class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.selectors = config.selectors.checkout;
  }

  async safeClickEditAddress() {
    const editButton = this.page.getByRole(
      this.selectors.editShippingAddress.role,
      { name: this.selectors.editShippingAddress.name }
    );

    if (await editButton.isVisible({ timeout: 5000 })) {
      await editButton.click();
      // Wait for the billing form to fully expand
      await this.page.waitForSelector("#shipping-first_name", {
        state: "visible",
        timeout: 3000,
      });
    }
  }

  async ensureBillingFormVisible() {
    // Wait for form container animation/transition
    await this.page.waitForFunction(
      () => {
        const form = document.querySelector("#shipping-first_name");
        return form && form.offsetParent !== null; // Checks computed visibility
      },
      { timeout: 3000 }
    );
  }

  // async fillShippingDetails(details) {
  //   await this.ensureBillingFormVisible();

  //   await this.page.locator(this.selectors.firstName).fill(details.firstName);
  //   await this.page.locator(this.selectors.lastName).fill(details.lastName);
  //   await this.page.locator(this.selectors.address).fill(details.address);
  //   await this.page.locator(this.selectors.city).fill(details.city);
  //   await this.page.locator(this.selectors.postcode).fill(details.postcode);
  // }

  async fillShippingDetails(details) {
    await this.ensureBillingFormVisible();

    // Add retry logic for postal code
    const fillWithRetry = async (selector, value) => {
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

    // Fill other fields normally
    await this.page.locator(this.selectors.firstName).fill(details.firstName);
    await this.page.locator(this.selectors.lastName).fill(details.lastName);
    await this.page.locator(this.selectors.address).fill(details.address);
    await this.page.locator(this.selectors.city).fill(details.city);

    // Special handling for postal code
    await fillWithRetry(this.selectors.postcode, details.postcode);
  }

  async placeOrder() {
    await this.page.locator(this.selectors.placeOrderButton).click();
    //await this.page.waitForURL(/order-received/, { timeout: 5000 });
  }
}
