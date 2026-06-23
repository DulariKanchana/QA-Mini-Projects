
function getOrdinal(day) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = day % 100;
    return day + (s[(v - 20) % 10] || s[v] || s[0]);
}

export class RegistrationForm {


    constructor(page) {
        this.page = page;
        this.firstName = page.getByRole('textbox', { name: 'First Name' });
        this.lastName = page.getByRole('textbox', { name: 'Last Name' });
        this.birthdayInput = page.locator('#dateOfBirthInput');
        this.imageUploadInput = page.locator('#uploadPicture');
        this.currentAddress = page.getByRole('textbox', { name: 'Current Address' });
        this.stateInput = page.locator('#state');
        this.cityInput = page.locator('#city');
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
        this.successModal = page.getByRole('dialog');
        this.successModalContent = page.getByRole('cell');
    }



    async openForm() {
        await this.page.goto('https://demoqa.com/automation-practice-form');
        //await this.page.waitForLoadState('domcontentloaded');
    }

    async fillRequiredFields({ fName, lName, email, gender, mobileNb }) {

        await this.firstName.fill(fName);
        await this.lastName.fill(lName);

        if (email) {
            await this.page.getByRole('textbox', { name: 'name@example.com' }).fill(email);
        }

        if (gender) {
            await this.selectGender(gender);
        }

        if (mobileNb) {
            await this.page.getByRole('textbox', { name: 'Mobile Number' }).fill(mobileNb);
        }
    }

    async selectGender(gender) {
        await this.getGender(gender).check();
    }

    async checkHobbies(hobby){
        await this.getHobbies(hobby).check();
    }

    async imageUpload(imagePath){
        await this.imageUploadInput.setInputFiles(imagePath);
    }

    async dateOfBirthPicker(day, month, year) {

        await this.birthdayInput.click();
        await this.page.getByRole('dialog', { name: 'Choose Date' }).waitFor({ state: 'visible' });
        await this.page.locator('.react-datepicker__year-select').selectOption(String(year));
        await this.page.locator('.react-datepicker__month-select').selectOption(String(month));

        const date = new Date(year, month, day);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthName = date.toLocaleDateString('en-US', { month: 'long' });

        const dayWithOrdinal = getOrdinal(day);
        const ariaLabel = `Choose ${weekday}, ${monthName} ${dayWithOrdinal}, ${year}`;
        await this.page.getByRole('gridcell', { name: ariaLabel }).click();
    }


    async selectSubject(subject) {
        await this.page.locator('#subjectsInput').fill(subject);
        await this.getOption(subject).waitFor({state: 'visible'});
        await this.getOption(subject).click();
    }

    async fillAddress(address) {
        await this.currentAddress.fill(address);
    }

    async stateCityDropdown({ state, city }) {
        if (state) {
            await this.stateInput.click();
            await this.getOption(state).waitFor({ state: 'visible' });
            await this.getOption(state).click();
        } else {
            await this.cityInput.click();
            await this.getOption(city).waitFor({ state: 'visible' });
            await this.getOption(city).click();
        }
    }

    getOption(optionName) {
        return this.page.getByRole('option', { name: optionName });
    }

    getGender(gender) {
        return this.page.getByRole('radio', { name: gender, exact: true });
    }

    getHobbies(hobby){
        return this.page.getByRole('checkbox', { name: hobby });
    }

    getSubject(subject){
        return this.page.getByText(subject, { exact: true });
    }

}