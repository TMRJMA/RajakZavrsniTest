"use strict";

require('chromedriver');
const webdriver = require('selenium-webdriver');
const { By, Key, until} = require('selenium-webdriver');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);


require('dotenv').config()

const RegisterPage = require('../pages/register.page');
const HomePage = require('../pages/home.page');
const LoginPage = require('../pages/login.page');
const OrderPage = require('../pages/order.page');
const CartPage = require('../pages/cart.page');
const CheckoutPage = require('../pages/checkout.page');
const PaymentPage = require('../pages/payment.page');

const testData = require('../data/food.json');

describe('test.QA.rs tests', function() {
    let driver;
    let request;

    let pageRegister;
    let pageHomepage;
    let pageLogin;
    let pageOrder
    let pageCart
    let pageCheckout;
    let pagePayment
    let packages;

    before(function() {
        request = chai.request(process.env.API_BASE_URL);

        driver = new webdriver.Builder().forBrowser(process.env.USE_BROWSER).build();
        pageHomepage = new HomePage(driver);
        pageRegister = new RegisterPage(driver);
        pageLogin = new LoginPage(driver);
        pageOrder = new OrderPage(driver)
        pageCart = new CartPage(driver)
        pageCheckout = new CheckoutPage(driver)
        pagePayment = new PaymentPage(driver)

        packages = testData.order;
    });

    after(async function() {
        await driver.quit();
    });

    it('Goes to registration page', async function() {
        await pageRegister.goToPage();
        expect(await pageRegister.getRegisterButtonValue()).to.contain('Register');
        expect(await pageRegister.getCurrentUrl()).to.be.eq('http://test.qa.rs/register');
    })

    it('Successfully performs registration', async function() {
        await pageRegister.getInputFirstName().sendKeys(testData.account.firstname);
        await pageRegister.getInputLastName().sendKeys(testData.account.lastname);
        await pageRegister.getInputEmail().sendKeys(testData.account.email);

        await pageRegister.fillInputUsername(`${process.env.LOGIN_USERNAME}`);
        await pageRegister.fillInputPassword(process.env.LOGIN_PASSWORD);
        await pageRegister.fillInputPasswordConfirm(process.env.LOGIN_PASSWORD);

        await pageRegister.getRegisterButton().click();

        await driver.sleep(3000)

        expect(await pageHomepage.getSuccessAlertText()).to.contain('Success!');
    });

    it('Goes to login page and performs login', async function() {
        await pageLogin.goToPage();
        await driver.sleep(3000)
        await pageLogin.fillInputUsername(process.env.LOGIN_USERNAME);
        await pageLogin.fillInputPassword(process.env.LOGIN_PASSWORD);
        await pageLogin.clickLoginButton();

        await driver.sleep(4000)

        expect(await pageHomepage.getWelcomeBackTitle()).to.contain('Welcome back');
    });

    it('Order Double Burger', async function() {
        await pageOrder.goToPage()
        await driver.sleep(3000)
        await driver.manage().window().maximize()
        await driver.executeScript('window.scrollBy(0,100), ""')
        await pageOrder.fillQuantity('panel panel-warning', 2)
        await pageOrder.selectSide('panel panel-warning', 'ms')
        await pageOrder.clickAddToCart('panel panel-warning')

        expect(await driver.getCurrentUrl()).to.contain('http://test.qa.rs/order');
    })

    it('Order Heart Attack', async function() {
        await pageOrder.goToPage()
        await driver.sleep(4000)
        await driver.manage().window().maximize()
        await driver.sleep(2000)
        await pageOrder.fillQuantity('panel panel-success', 4)
        await pageOrder.selectSide('panel panel-success', 'or')
        await pageOrder.clickCutlery('panel panel-success')
        await pageOrder.clickAddToCart('panel panel-success')


        expect(await driver.getCurrentUrl()).to.contain('http://test.qa.rs/order');
    })



    it('Verifies items are in cart', async () => {
        await pageHomepage.clickOnViewShoppingCartLink();
        await driver.sleep(2000)

        expect(await pageCart.getCurrentUrl()).to.be.eq('http://test.qa.rs/cart');

        for (const index in packages) {
            const item = packages[index];

            const orderRow = await pageCart.getOrderRow(item.package.toUpperCase());
            const itemQuantity = await pageCart.getItemQuantity(orderRow);

            expect(await itemQuantity.getText()).to.eq(item.quantity.toString());
        }
    });

    it('Verifies total item price is correct', async function() {
        for (const index in packages) {
            const item = packages[index];

            const orderRow = await pageCart.getOrderRow(item.package.toUpperCase());
            const itemQuantity = await pageCart.getItemQuantity(orderRow);
            const itemPrice = await pageCart.getItemPrice(orderRow);
            const itemPriceTotal = await pageCart.getItemPriceTotal(orderRow);

            const quantity = Number(await itemQuantity.getText())

            const price = eval((await itemPrice.getText()).replaceAll('$', ''))
            const total = Number((await itemPriceTotal.getText()).substring(1));

            const price2 = eval((await itemPrice.getText()).replaceAll('$', ''));
            const total2 = Number((await itemPriceTotal.getText()).replace('$', ''));

            const price3 = eval((await itemPrice.getText()).replace(/\$/g, ''));
            const total3 =  Number((await itemPriceTotal.getText()).replace(/\$/g, ''));

            const calculatedItemPriceTotal = quantity * price;
            const calculatedItemPriceTotal2 = quantity * price2;
            const calculatedItemPriceTotal3 = quantity * price3;

            expect(calculatedItemPriceTotal).to.be.eq(total);
            expect(calculatedItemPriceTotal2).to.be.eq(total2);
            expect(calculatedItemPriceTotal3).to.be.eq(total3);
        }
    });


    it('Verifies total item price is  = II nacin', async function() {
        for (const index in packages) {
            const item = packages[index];

            const orderRow = await pageCart.getOrderRow(item.package.toUpperCase());
            const itemQuantity = await pageCart.getItemQuantity(orderRow);
            const itemPrice = await pageCart.getItemPrice(orderRow);
            const itemPriceTotal = await pageCart.getItemPriceTotal(orderRow);

            const quantity = Number(await itemQuantity.getText())

            const priceArray = (await itemPrice.getText()).replaceAll('$', '').replaceAll(' ', '').split('+')
            let price = 0;
            for(let i=0; i<priceArray.length; i++) {
                price+=Number(priceArray[i])
            }
            const total = Number((await itemPriceTotal.getText()).substring(1));


            const calculatedItemPriceTotal = quantity * price;

            expect(calculatedItemPriceTotal).to.be.eq(total);
        }
    });

    it('Performs checkout', async function() {
        await pageCart.clickOnCheckoutButton();

        expect(await pageCheckout.getPageTitle()).to.contain('You have successfully placed your order.');
    });
    it('Performs paid', async() => {

        const orderId = await pagePayment.getOrderId()
        const userId = await pagePayment.getUserId()
        const amount = await pagePayment.getPrice()
        request.post('/api/payment')
            .send({
                "order_id": orderId,
                "user_id": userId,
                "status": "paid",
                "amount": amount
        })
            .end((error, response) => {
                response.should.have.status(200);
            });

        await driver.sleep(3000)

        await pagePayment.goToHistoryPage()
        await driver.sleep(3000)

        const orderRow = await pagePayment.getOrderRow(orderId);
        const orderStatus = await pagePayment.getOrderStatus(orderRow);

        expect(await orderStatus.getText()).to.be.eq('paid')

    });






});