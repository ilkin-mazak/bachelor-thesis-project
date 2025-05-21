import { Page, Locator, expect } from "@playwright/test";
import { loadConfig } from "../helpers/config-loader.js";

type ShippingDetails = any;

export default class CheckoutPage {
  private readonly page: Page;
  public readonly config: ReturnType<typeof loadConfig>; // Dynamic config
  private readonly selectors: any;

  constructor(page: Page) {
    this.page = page;
    this.config = loadConfig(); // Load config dynamically
    this.selectors = this.config.selectors.checkout;
  }

  async clickEditAddress(): Promise<void> {
    try {
      // first try using the selector
      const editButton = this.page.locator(
        this.selectors.editShippingAddress.button
      );

      // then check if the button is visible with the selector
      if (await editButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await editButton.click({ force: true });
      }

      // trying text content approach
      else {
        const textEditButton = this.page.getByText("Edit", { exact: true });
        await textEditButton.waitFor({ state: "visible", timeout: 5000 });
        await textEditButton.click({ force: true });
      }

      // wait for first name field
      await this.page.locator(this.selectors.firstName).waitFor({
        state: "visible",
        timeout: 5000,
      });
    } catch (error) {
      console.log("Error clicking edit address button:", error);
      // print the error message but continue the test flow
      // because some platforms may not require editing
    }
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    //verify the firstName field visible, then fill in
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
    await this.page.waitForSelector(this.selectors.placeOrderButton, {
      state: "visible",
      timeout: 5000,
    });
    const btn = this.page.locator(this.selectors.placeOrderButton);
    await btn.click({ force: true, noWaitAfter: true, timeout: 5000 });
  }

  async verifyOrderConfirmation(): Promise<void> {
    // verify the order received heading
    await expect(
      this.page.getByRole(
        this.selectors.orderReceivedHeading.role as "heading",
        { name: this.selectors.orderReceivedHeading.name }
      )
    ).toBeVisible();

    // also verify the URL
    await this.page.waitForURL(new RegExp(this.config.paths.orderReceived));
  }

  async clickContinueButton(): Promise<void> {
    await this.page.locator(this.selectors.continueButton).click();
    await this.page.waitForLoadState("networkidle");
  }

  async agreeToTerms(): Promise<void> {
    const termsCheckbox = this.page.locator(this.selectors.termsCheckbox);
    await termsCheckbox.waitFor({ state: "visible", timeout: 5000 });
    await termsCheckbox.check({ noWaitAfter: true });
  }

  async confirmAddress(): Promise<void> {
    await this.page.locator(this.selectors.confirmAddressButton).click();
    // await this.page.waitForLoadState("networkidle");
  }

  async confirmShipping(): Promise<void> {
    await this.page
      .locator(this.selectors.confirmShippingButton)
      .click({ noWaitAfter: true });
  }
}
