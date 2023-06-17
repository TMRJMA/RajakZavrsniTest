"use strict";

const { By } = require("selenium-webdriver");
const BasePage = require('./base.page');

module.exports = class HomePage extends BasePage {

    goToPage() {
        this.driver().get('http://test.qa.rs/');
    }


    getSuccessAlertText() {
        return this.driver().findElement(By.className('alert alert-success')).getText();
    }

    getWelcomeBackTitle() {
        return this.driver().findElement(By.tagName('h2')).getText();
    }

}