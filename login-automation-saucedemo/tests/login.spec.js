import { test, expect } from '@playwright/test';

test('Successful login with valid credentials @TC-01', async ({ page }) => {

    await page.goto('https://www.saucedemo.com');

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});


test('Login failure with non-existent username @TC-02', async ({page}) => {

    await page.goto('https://www.saucedemo.com');

    await page.locator('[data-test="username"]').fill('invalid_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
});


test('Login failure with invalid password @TC-03', async ({page}) => {

    await page.goto('https://www.saucedemo.com');
   
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secretsauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
});

test('Login with empty fields @TC-04', async ({page}) => {

    await page.goto('https://www.saucedemo.com');

    await page.locator('[data-test="username"]').fill('');
    await page.locator('[data-test="password"]').fill('');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username is required');

});

test('Password character masking works correctly @TC-05', async ({page}) => {

    await page.goto('https://www.saucedemo.com');
    await expect(page.locator('[data-test="password"]')).toHaveAttribute('type', 'password');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await expect(page.locator('[data-test="password"]')).toHaveValue('secret_sauce');

});




