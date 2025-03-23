//CheckoutPage.ts
import { Page, Locator, expect } from "@playwright/test";
import config from "../config/site-config.json" with { type: "json" };

type ShippingDetails = typeof config.testData.shippingDetails;

export default class CheckoutPage {
  private readonly page: Page;
  private readonly selectors: typeof config.selectors.checkout;

  constructor(page: Page) {
    this.page = page;
    this.selectors = config.selectors.checkout; // Contains all checkout selectors
  }

async clickEditAddress(): Promise<void> {
  // 1. Use configured container selector
  const addressContainer = this.page.locator(
    this.selectors.editShippingAddress.container
  );
  await addressContainer.waitFor({ state: "visible" });

  // 2. Use configured button selector
  const editButton = addressContainer.locator(
    this.selectors.editShippingAddress.button
  );

  // 3. Simple visibility check with config-driven timeout
  await editButton.waitFor({ state: "visible"});
  await editButton.click();

  // 4. Wait for form fields using config selectors
  await this.page.locator(this.selectors.firstName).waitFor();
}


  async fillShippingDetails(details: ShippingDetails): Promise<void> {

await this.page.waitForSelector(this.selectors.firstName, {
  state: "visible"
});
    await Promise.all([
      this.page.locator(this.selectors.firstName).fill(details.firstName),
      this.page.locator(this.selectors.lastName).fill(details.lastName),
      this.page.locator(this.selectors.address).fill(details.address),
      this.page.locator(this.selectors.city).fill(details.city),
      this.page.locator(this.selectors.postcode).fill(details.postcode)
    ]);
  }


  async placeOrder(): Promise<void> {  
    await this.page.waitForLoadState("networkidle");  
    await this.page.locator(this.selectors.placeOrderButton).click();  
    await expect(  
    this.page.getByRole(  
        config.selectors.checkout.orderReceivedHeading.role as "heading",  
        { name: config.selectors.checkout.orderReceivedHeading.name }  
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
  await this.page.waitForURL(
    new RegExp(config.paths.orderReceived)
  );
}
}
