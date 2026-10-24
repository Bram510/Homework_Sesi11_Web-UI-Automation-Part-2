const { By } = require("selenium-webdriver");

module.exports = {
    url: "https://www.saucedemo.com/",
    selectors: {
        usernameInput: By.xpath("//*[@data-test='username']"),
        passwordInput: By.xpath("//*[@data-test='password']"),
        loginButton: By.xpath("//*[@data-test='login-button']"),
        shoppingCart: By.xpath("//*[@data-test='shopping-cart-link']"),
        errorMessage: By.xpath("//*[@data-test='error']")
    }
};