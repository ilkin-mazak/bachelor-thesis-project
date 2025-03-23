import { expect, Page } from "playwright/test";

export async function assertVisible(page: Page, selector: string) {
  const element = page.locator(selector);
  await expect(element).toBeVisible({ timeout: 15000 });
}

export async function assertTextContent(
  page: Page,
  selector: string,
  text: string
) {
  const element = page.locator(selector);
  await expect(element).toContainText(text, { timeout: 10000 });
}
