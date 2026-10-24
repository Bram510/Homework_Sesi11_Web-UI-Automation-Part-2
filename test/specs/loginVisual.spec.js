const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome"); // 1. Wajib import modul chrome
const assert = require("assert");
const loginPage = require("../pages/login.page");
const commonPage = require("../pages/common.page");
const visualRegression = require("../../utilities/visualRegression.helper");

describe("Open Sauce Demo", function () {
    this.timeout(60000); // Set timeout global 60 detik

    let driver;
    let login;
    let common;
    let visualHelper = new visualRegression();

    // Gabungkan konfigurasi options dan inisialisasi driver dalam SATU beforeEach
    beforeEach(async function () {
        // Buat konfigurasi options untuk menonaktifkan pop-up password & save
        let options = new chrome.Options();
        
        options.setUserPreferences({
            "credentials_enable_service": false,
            "profile.password_manager_enabled": false
        });
        
        options.addArguments("--disable-save-password-bubble");
        options.addArguments("--disable-infobars");
        options.addArguments("--disable-autofill-keyboard-accessory-view");

        // Bangun driver dengan opsi chrome yang sudah dibuat
        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        login = new loginPage(driver);
        common = new commonPage(driver);
        visualHelper = new visualRegression();
        await login.openBrowser();
    });

    afterEach(async function () {
        await driver.quit();
    });

    it("Success Login - Standard User", async function () {
        await login.inputUsername("standard_user");
        await login.inputPassword("secret_sauce");
        await login.clickLoginButton();
        await login.isShoppingCartVisible();

        // take full screenshot after successful login
        await common.fullScreenshot("visual_standard_user");

        // Copy screenshot to visual-current
        visualHelper.saveCurrentScreenshot(
            "screenshots/visual_standard_user.png",
            "visual_standard_user.png"
        );

        // Compare with baseline
        const result = await visualHelper.compareImages(
            "visual_standard_user.png"
        );

        console.log(result);

        // If baseline doesn't exist
        if (!result.hasBaseline) {
            visualHelper.saveAsBaseline(
                "visual_standard_user.png"
            );
            console.log(
                "Baseline created: visual_standard_user.png"
            );
        } else {
            assert.strictEqual(
                result.match,
                true,
                result.message
            );
        }
    });

    it.skip("Success Login - Performance Glitch User", async function () {
        await login.inputUsername("performance_glitch_user");
        await login.inputPassword("secret_sauce");
        await login.clickLoginButton();
        await login.isShoppingCartVisible();

        // take element screenshot of shopping cart after successful login
        await common.elementScreenshot(By.xpath("//*[@data-test='shopping-cart-link']"), 
        "shopping_cart_performance_glitch_user");
    });
});