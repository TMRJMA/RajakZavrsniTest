"use strict";

const { By, Select } = require('selenium-webdriver');
const BasePage = require('./base.page');

module.exports = class PaymentPage extends BasePage {

    goToHistoryPage() {
        this.driver().get(`http://test.qa.rs/history`);
    }

    async getOrderId() {
        let orderText = await this.driver().findElement(By.css('h2'));
        const numberOfOrder = (await orderText.getText()).split("#")[1].replace(/\D/g, '');
        return Number(numberOfOrder)
    }

    async getPrice() {
        let priceText = await this.driver().findElement(By.css('h3'));
        const numberOfPrice = (await priceText.getText()).split("$")[1]
        return Number(numberOfPrice)
    }

    async getUserId() {
        let userPart = await this.driver().findElement(By.css('.nav > li:last-child'));
        const userID = (await userPart.getText()).split("ID:")[1].replace(/\D/g, '');
        return Number(userID)
    }

    getOrderRow(orderID) {
        const xpathOrderRow = `//td[contains(., "#${orderID}")]/parent::tr`;
        return this.driver().findElement(By.xpath(xpathOrderRow));
    }

    getOrderStatus(orderRow) {
        return orderRow.findElement(By.xpath('td[5]'));
    }

}