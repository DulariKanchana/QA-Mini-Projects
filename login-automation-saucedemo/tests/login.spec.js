import {test, expect} from '@playwright/test';
import { SauceDemoLogin } from '../pages/login';

test.describe('SauceDemo Tests', () => {

    let login;

    test.beforeEach(async ({page}) => {
        login = new SauceDemoLogin(page);
        await login.gotoLoginPage();
    });

    test('Successful login with valid credentials @TC-01', async ({page}) =>{

        await login.loginFunctionality('standard_user','secret_sauce');

        // await page.locator('[data-test="username"]').fill('standard_user');
        // await page.locator('[data-test="password"]').fill('secret_sauce');
        // await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });


    test('Login failure with non-existent username @TC-02', async () =>{
        
        await login.loginFunctionality('invalid_user', 'secret_sauce')
        
        // await page.locator('[data-test="username"]').fill('invalid_user');
        // await page.locator('[data-test="password"]').fill('secret_sauce');
        // await page.locator('[data-test="login-button"]').click();

        await expect(login.errorMessage).toBeVisible();
        await expect(login.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
    });


    test('Login failure with invalid password @TC-03', async () =>{

        await login.loginFunctionality('standard_user', 'secretsauce');
        
        // await page.locator('[data-test="username"]').fill('standard_user');
        // await page.locator('[data-test="password"]').fill('secretsauce');
        // await page.locator('[data-test="login-button"]').click();

        await expect(login.errorMessage).toBeVisible();
        await expect(login.errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
    });

    test('Login with empty fields @TC-04', async () =>{

        await login.loginFunctionality('', '')
        
        // await page.locator('[data-test="username"]').fill('');
        // await page.locator('[data-test="password"]').fill('');
        // await page.locator('[data-test="login-button"]').click();

        await expect(login.errorMessage).toBeVisible();
        await expect(login.errorMessage).toContainText('Epic sadface: Username is required');

    });

    test('Password character masking works correctly @TC-05', async () =>{

        await expect(login.passwordInput).toHaveAttribute('type', 'password');
        await login.fillPassword('secret_sauce');
        await expect(login.passwordInput).toHaveValue('secret_sauce'); 

    });
});




