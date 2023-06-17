"use strict";

const { By } = require("selenium-webdriver");

module.exports = class BasePage {
    #driver;

    constructor(webdriver) {
        this.#driver = webdriver;
    }

    driver() {
        return this.#driver;
    }

    getCurrentUrl() {
        return this.driver().getCurrentUrl();
    }


    getPageTitle() {
        return this.driver().findElement(By.tagName('h2')).getText()
    }


    async clickOnViewShoppingCartLink() {
        const linkShoppingCart = await this.driver().findElement(By.partialLinkText('shopping cart'))
        await linkShoppingCart.click();
    }


}