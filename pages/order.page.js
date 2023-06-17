"use strict";

const { By, Select } = require('selenium-webdriver');
const BasePage = require('./base.page');

module.exports = class OrderPage extends BasePage {

    goToPage() {
        this.driver().get('http://test.qa.rs/');
    }

    getProduct(productClass) {
        return this.driver().findElement(By.className(productClass));
    }

    getQuantity(productClass) {
        return this.getProduct(productClass).findElement(By.name('quantity'));
    }

    getSide(productClass) {
        return this.getProduct(productClass).findElement(By.name('side'));
    }


    async fillQuantity(productClass,quantity) {
        const quat = await this.getQuantity(productClass)
        await quat.clear()
        await quat.sendKeys(quantity);
    }

    async selectSide(productClass, side) {
        let select = new Select(this.getSide(productClass))
        await select.selectByValue(side)
    }

    async clickCutlery(productClass) {
        let button = await this.getProduct(productClass).findElement(By.name('cutlery'));
        await button.click()
   }


    async clickAddToCart(productClass) {
        let button = await this.getProduct(productClass).findElement(By.className('btn btn-success'));
        await button.click()
    }
}