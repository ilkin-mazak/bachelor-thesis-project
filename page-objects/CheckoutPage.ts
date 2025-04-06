//CheckoutPage.ts
import { Page, Locator, expect } from "@playwright/test";
import { loadConfig } from "../helpers/config-loader.js"; // Changed import

type ShippingDetails = any; // Simplified type (original was tied to old config)

export default class CheckoutPage {
  private readonly page: Page;
  public readonly config: ReturnType<typeof loadConfig>; // Added dynamic config
  private readonly selectors: any; // Changed from typeof config.selectors.checkout

  constructor(page: Page) {
    this.page = page;
    this.config = loadConfig(); // Load config dynamically
    this.selectors = this.config.selectors.checkout; // Updated reference
  }

  async clickEditAddress(): Promise<void> {
    const addressContainer = this.page.locator(
      this.selectors.editShippingAddress.container
    );

    if (!(await addressContainer.isVisible())) {
      return;
    }
    const editButton = addressContainer.locator(
      this.selectors.editShippingAddress.button
    );

    if (!(await editButton.isVisible())) {
      return;
    }

    await editButton.click();

    const firstNameField = this.page.locator(this.selectors.firstName);
    if (!(await firstNameField.isVisible())) {
      return;
    }
    await firstNameField.waitFor({ state: "visible" });
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    await this.page.waitForSelector(this.selectors.firstName, {
      state: "visible",
    });
    await this.page.locator(this.selectors.firstName).fill(details.firstName);
    await this.page.locator(this.selectors.lastName).fill(details.lastName);
    await this.page.locator(this.selectors.address).fill(details.address);
    await this.page.locator(this.selectors.city).fill(details.city);
    await this.page.locator(this.selectors.postcode).fill(details.postcode);
  }

  async placeOrder(): Promise<void> {
    await this.page.locator(this.selectors.placeOrderButton).click();
    await expect(
      this.page.getByRole(
        this.selectors.orderReceivedHeading.role as "heading",
        { name: this.selectors.orderReceivedHeading.name }
      )
    ).toBeVisible();
  }

  async verifyOrderConfirmation(): Promise<void> {
    //verify the heading
    await expect(
      this.page.getByRole(
        this.selectors.orderReceivedHeading.role as "heading",
        { name: this.selectors.orderReceivedHeading.name }
      )
    ).toBeVisible();

    // Verify the URL
    await this.page.waitForURL(new RegExp(this.config.paths.orderReceived));
  }
}
