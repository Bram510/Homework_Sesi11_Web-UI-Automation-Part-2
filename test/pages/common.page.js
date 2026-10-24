const fs = require('fs');
const path = require('path');

class CommonPage {
    constructor(driver) {
        this.driver = driver;
    }

    async fullScreenshot(filename) {
        const imageBuffer = await this.driver.takeScreenshot();
        const dir = path.join(__dirname, '../../screenshots');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path.join(dir, `${filename}.png`), imageBuffer, 'base64');
    }

    async elementScreenshot(locator, filename) {
        const element = await this.driver.findElement(locator);
        const imageBuffer = await element.takeScreenshot();
        const dir = path.join(__dirname, '../../screenshots');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(path.join(dir, `${filename}.png`), imageBuffer, 'base64');
    }
}

module.exports = CommonPage;