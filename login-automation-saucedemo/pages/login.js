export class SauceDemoLogin{
    
    constructor(page){
        this.page = page;
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
    }

    async gotoLoginPage(){
        await this.page.goto('https://www.saucedemo.com');
    }

    async loginFunctionality(username, password){
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async fillPassword(password){
        await this.passwordInput.fill(password);
    }

}