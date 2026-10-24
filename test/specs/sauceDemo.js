const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");
const LoginPage = require("../pages/login.page");
const CommonPage = require("../pages/common.page");
const VisualRegressionHelper = require("../../utilities/visualRegression.helper");

describe("Sauce Demo - Positive & Negative Test with Visual Regression", function () {
    this.timeout(60000);

    let driver;
    let login;
    let common;
    let visualHelper;

    beforeEach(async function () {
        let options = new chrome.Options();
        options.setUserPreferences({
            "credentials_enable_service": false,
            "profile.password_manager_enabled": false
        });
        options.addArguments("--disable-save-password-bubble");
        options.addArguments("--disable-infobars");
        options.addArguments("--disable-autofill-keyboard-accessory-view");

        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        login = new LoginPage(driver);
        common = new CommonPage(driver);
        visualHelper = new VisualRegressionHelper();
        await login.openBrowser();
    });

    afterEach(async function () {
        await driver.quit();
    });

    // 1. POSITIVE TEST: Standard User
    it("Positive Test - Success Login Standard User", async function () {
        await login.inputUsername("standard_user");
        await login.inputPassword("secret_sauce");
        await login.clickLoginButton();
        
        const isCartVisible = await login.isShoppingCartVisible();
        assert.strictEqual(isCartVisible, true, "Shopping cart should be visible");

        await common.fullScreenshot("success_login_standard");
        visualHelper.saveCurrentScreenshot("screenshots/success_login_standard.png", "success_login_standard.png");

        const result = await visualHelper.compareImages("success_login_standard.png");
        if (!result.hasBaseline) {
            visualHelper.saveAsBaseline("success_login_standard.png");
        } else {
            assert.strictEqual(result.match, true, result.message);
        }
    });

    // 2. NEGATIVE TEST: Invalid Username
    it("Negative Test - Invalid Username", async function () {
        await login.inputUsername("invalid_user");
        await login.inputPassword("secret_sauce");
        await login.clickLoginButton();

        const errorMessage = await login.getErrorMessage();
        assert.ok(errorMessage.includes("Epic sadface"), "Error message should appear");

        await common.fullScreenshot("negative_invalid_username");
        visualHelper.saveCurrentScreenshot("screenshots/negative_invalid_username.png", "negative_invalid_username.png");

        const result = await visualHelper.compareImages("negative_invalid_username.png");
        if (!result.hasBaseline) {
            visualHelper.saveAsBaseline("negative_invalid_username.png");
        } else {
            assert.strictEqual(result.match, true, result.message);
        }
    });

    // 3. NEGATIVE TEST: Wrong Password
    it("Negative Test - Wrong Password", async function () {
        await login.inputUsername("standard_user");
        await login.inputPassword("wrong_password");
        await login.clickLoginButton();

        const errorMessage = await login.getErrorMessage();
        assert.ok(errorMessage.includes("Epic sadface"), "Error message should appear");

        await common.fullScreenshot("negative_wrong_password");
        visualHelper.saveCurrentScreenshot("screenshots/negative_wrong_password.png", "negative_wrong_password.png");

        const result = await visualHelper.compareImages("negative_wrong_password.png");
        if (!result.hasBaseline) {
            visualHelper.saveAsBaseline("negative_wrong_password.png");
        } else {
            assert.strictEqual(result.match, true, result.message);
        }
    });

    // 4. NEGATIVE TEST: Locked Out User
    it("Negative Test - Locked Out User", async function () {
        await login.inputUsername("locked_out_user");
        await login.inputPassword("secret_sauce");
        await login.clickLoginButton();

        const errorMessage = await login.getErrorMessage();
        assert.ok(errorMessage.includes("Sorry, this user has been locked out"), "Locked out message should appear");

        await common.fullScreenshot("negative_locked_out");
        visualHelper.saveCurrentScreenshot("screenshots/negative_locked_out.png", "negative_locked_out.png");

        const result = await visualHelper.compareImages("negative_locked_out.png");
        if (!result.hasBaseline) {
            visualHelper.saveAsBaseline("negative_locked_out.png");
        } else {
            assert.strictEqual(result.match, true, result.message);
        }
    });
});