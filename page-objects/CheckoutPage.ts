//CheckoutPage.ts
import { Page, Locator, expect } from "@playwright/test";
import { loadConfig } from "../helpers/config-loader.js";

type ShippingDetails = any;

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
    const container = this.page.locator(
      this.selectors.editShippingAddress.container
    );
    await container.waitFor({ state: "visible", timeout: 15000 });

    const editButton = container.locator(
      this.selectors.editShippingAddress.button
    );
    await editButton.waitFor({ state: "attached", timeout: 15000 });
    await editButton.click({ force: true });

    // Wait for address form fields
    await this.page.waitForSelector(this.selectors.firstName, {
      state: "visible",
      timeout: 15000,
    });
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
    // await expect(
    //   this.page.getByRole(
    //     this.selectors.orderReceivedHeading.role as "heading",
    //     { name: this.selectors.orderReceivedHeading.name }
    //   )
    // ).toBeVisible();

    // Verify the URL
    await this.page.waitForURL(new RegExp(this.config.paths.orderReceived));
  }
  async clickContinueButton(): Promise<void> {
    await this.page.locator(this.selectors.continueButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async agreeToTerms(): Promise<void> {
    const termsCheckbox = this.page.locator(this.selectors.termsCheckbox);

    // 1. Wait for checkbox existence and visibility
    await termsCheckbox.waitFor({ state: "visible", timeout: 5000 });

    // 2. Scroll into view (for WebKit/Firefox compatibility)
    // await termsCheckbox.scrollIntoViewIfNeeded();

    // 3. Check with force and simple retry
    await termsCheckbox.check({
      force: true,
      timeout: 3000,
    });
  }

  async confirmAddress(): Promise<void> {
    await this.page.locator(this.selectors.confirmAddressButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async confirmShipping(): Promise<void> {
    await this.page.locator(this.selectors.confirmShippingButton).click();
    //await this.page.waitForLoadState("networkidle");
  }
}
