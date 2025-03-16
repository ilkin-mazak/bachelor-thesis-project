import config from "../config/site-config.json" assert { type: "json" };

export default class LoginPage {
  constructor(page) {
    this.page = page;
    this.selectors = config.selectors.login;
  }

  async navigateToLogin() {
    // Use full URL from config
    await this.page.goto(`${config.baseURL}/my-account`);
  }

  async login(username, password) {
    await this.page.locator(this.selectors.username).fill(username);
    await this.page.locator(this.selectors.password).fill(password);
    await this.page.locator(this.selectors.submitButton).click();
  }
}
