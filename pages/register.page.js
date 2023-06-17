"use strict";

const { By } = require('selenium-webdriver');
const BasePage = require('./base.page');

module.exports = class RegisterPage extends BasePage {
    constructor(driver) {
        super(driver)
    }
    goToPage() {
        this.driver().get('http://test.qa.rs/register');
    }

    getRegisterButton() {
        return this.driver().findElement(By.name('register'));
    }

    getRegisterButtonValue() {
        return this.getRegisterButton().getAttribute('value');
    }

    getInputFirstName() {
        return this.driver().findElement(By.name('firstname'));
    }

    getInputLastName() {
        return this.driver().findElement(By.name('lastname'));
    }

    getInputEmail() {
        return this.driver().findElement(By.name('email'));
    }

    fillInputUsername(username) {
        this.driver().findElement(By.name('username')).sendKeys(username);
    }

    fillInputPassword(password) {
        this.driver().findElement(By.id('password')).sendKeys(password);
    }

    fillInputPasswordConfirm(password) {
        this.driver().findElement(By.id('passwordAgain')).sendKeys(password);
    }
}