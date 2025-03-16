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

    if (await editButton.isVisible()) {
      await editButton.click();
      // Wait for click to register but no network requirement
      await this.page.waitForTimeout(200);
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

  async fillShippingDetails(details) {
    await this.ensureBillingFormVisible();

    await this.page.locator(this.selectors.firstName).fill(details.firstName);
    await this.page.locator(this.selectors.lastName).fill(details.lastName);
    await this.page.locator(this.selectors.address).fill(details.address);
    await this.page.locator(this.selectors.city).fill(details.city);
    await this.page.locator(this.selectors.postcode).fill(details.postcode);
  }

  async placeOrder() {
    await this.page.locator(this.selectors.placeOrderButton).click();
    await this.page.waitForURL(/order-received/, { timeout: 5000 });
  }
}
