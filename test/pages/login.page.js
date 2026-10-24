const { until } = require("selenium-webdriver");
const loginLocator = require("../locators/login.locator");

class LoginPage {
    constructor(driver) {
        this.driver = driver;
    }

    async openBrowser() {
        await this.driver.get(loginLocator.url);
        await this.driver.wait(async () => {
            const url = await this.driver.getCurrentUrl();
            return url === loginLocator.url;
        }, 5000).catch(() => {});
    }

    async inputUsername(username) {
        const inputUsername = await this.driver.findElement(loginLocator.selectors.usernameInput);
        await inputUsername.clear();
        await inputUsername.sendKeys(username);
    }

    async inputPassword(password) {
        const inputPassword = await this.driver.findElement(loginLocator.selectors.passwordInput);
        await inputPassword.clear();
        await inputPassword.sendKeys(password);
    } 

    async clickLoginButton() {
        const loginButton = await this.driver.findElement(loginLocator.selectors.loginButton);
        await loginButton.click();
    }

    async isShoppingCartVisible() {
        const shoppingCart = await this.driver.wait(
            until.elementLocated(loginLocator.selectors.shoppingCart),
            5000
        );
        return shoppingCart.isDisplayed();
    }

    async getErrorMessage() {
        const errorElement = await this.driver.wait(
            until.elementLocated(loginLocator.selectors.errorMessage),
            5000
        );
        return await errorElement.getText();
    }
}

module.exports = LoginPage;