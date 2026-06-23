import { test, expect } from '@playwright/test';
import { RegistrationForm } from '../pages/registration';
import testData from '../test-data/testData.json';

test.describe('DemoQA Student Registration Tests', () => {

    /** @type {RegistrationForm} */
    let reg;

    test.beforeEach('Navigation', async ({ page }) => {
        reg = new RegistrationForm(page);
        await reg.openForm();
    });

    test('Submit form with all valid required fields @TC-01', async () => {

        await reg.fillRequiredFields(testData.validUser);

        await reg.submitBtn.click();
        await expect(reg.successModal).toBeVisible();
        await expect(reg.successModal).toContainText(testData.successMessage);

    });

    test('Submit form with all fields including optional @TC-02', async () => {
        
        await reg.fillRequiredFields(testData.validUserWithEmail);
        await reg.dateOfBirthPicker(
            testData.dateOfBirth.day,
            testData.dateOfBirth.month,
            testData.dateOfBirth.year
        );
        await reg.selectSubject(testData.allValidDetails.subject);
        await reg.checkHobbies(testData.allValidDetails.hobby);
        await reg.imageUpload(testData.imagePath);
        await reg.fillAddress(testData.allValidDetails.address);
        await reg.stateCityDropdown({ state: testData.state.rajasthan });
        await reg.stateCityDropdown({ city: testData.city.jaipur});

        await reg.submitBtn.click();

        await expect(reg.successModal).toBeVisible();
        await expect(reg.successModal).toContainText(testData.successMessage);
        
        await expect(reg.successModalContent).toContainText([
            testData.allValidDetails.fullName,
            testData.allValidDetails.email,
            testData.allValidDetails.gender,
            testData.allValidDetails.mobile,
            testData.allValidDetails.birthday,
            testData.allValidDetails.subject,
            testData.allValidDetails.hobby,
            'Prp.jpg',
            testData.allValidDetails.address,
            testData.allValidDetails.stateCity
        ]);
    });

    test('Select gender radio button @TC-03', async () => {

        await reg.selectGender(testData.chooseGender.male);
        await expect(reg.getGender(testData.chooseGender.male)).toBeChecked();

        await reg.selectGender(testData.chooseGender.female);
        await expect(reg.getGender(testData.chooseGender.female)).toBeChecked();
        await expect(reg.getGender(testData.chooseGender.male)).not.toBeChecked();

        await reg.selectGender(testData.chooseGender.other);
        await expect(reg.getGender(testData.chooseGender.other)).toBeChecked();
        await expect(reg.getGender(testData.chooseGender.female)).not.toBeChecked();

    });

    test('Select multiple hobbies checkboxes @TC-04', async () => {

        await reg.checkHobbies(testData.chooseHobby.sports);
        await expect(reg.getHobbies(testData.chooseHobby.sports)).toBeChecked();

        await reg.checkHobbies(testData.chooseHobby.reading);
        await expect(reg.getHobbies(testData.chooseHobby.reading)).toBeChecked();

        await reg.checkHobbies(testData.chooseHobby.music);
        await expect(reg.getHobbies(testData.chooseHobby.music)).toBeChecked();

        await expect(reg.getHobbies(testData.chooseHobby.sports)).toBeChecked();
        await expect(reg.getHobbies(testData.chooseHobby.reading)).toBeChecked();
        await expect(reg.getHobbies(testData.chooseHobby.music)).toBeChecked();

        await reg.getHobbies(testData.chooseHobby.sports).uncheck();
        await expect(reg.getHobbies(testData.chooseHobby.reading)).toBeChecked();
        await expect(reg.getHobbies(testData.chooseHobby.music)).toBeChecked();

    });

    test('Select subject from autocomplete @TC-05', async () => {

        await reg.selectSubject(testData.fillSubject.maths);
        await reg.selectSubject(testData.fillSubject.english);

        await expect(reg.getSubject(testData.fillSubject.maths)).toBeVisible();
        await expect(reg.getSubject(testData.fillSubject.english)).toBeVisible();
    });


    test('Select date of birth from date picker @TC-06', async () => {

        await reg.dateOfBirthPicker(5, 0, 2022);
        await expect(reg.birthdayInput).toHaveValue(testData.birthday);

    });

    test('Upload a profile picture @TC-07', async () => {
        await reg.imageUpload(testData.imagePath);
        await expect(reg.imageUploadInput).toHaveValue(/Prp.jpg/);

    });

    test('Select state and city from dropdown @TC-08', async () => {

        await reg.stateCityDropdown({ state: testData.state.ncr});
        await expect(reg.stateInput).toContainText(testData.state.ncr);

        await reg.stateCityDropdown({ city: testData.city.delhi});
        await expect(reg.cityInput).toContainText(testData.city.delhi);

        await reg.stateCityDropdown({ state: testData.state.rajasthan});

        await reg.cityInput.click();
        await expect(reg.getOption(testData.city.jaipur)).toBeVisible();
        await expect(reg.getOption(testData.city.jaiselmer)).toBeVisible();

        await expect(reg.getOption(testData.city.delhi)).not.toBeVisible();
        await expect(reg.getOption(testData.city.gurgaon)).not.toBeVisible();
        await expect(reg.getOption(testData.city.noida)).not.toBeVisible();

    });

    
    test('Submit form with no fields filled @TC-09', async () => {
        await reg.submitBtn.click();
        await expect(reg.successModal).not.toBeVisible();
    });

    test('Submit form with only name filled @TC-10', async () => {

        await reg.fillRequiredFields(testData.nameOnly);

        await reg.submitBtn.click();
        await expect(reg.successModal).not.toBeVisible();

        await expect(reg.firstName).toHaveValue(testData.nameOnly.fName);
        await expect(reg.lastName).toHaveValue(testData.nameOnly.lName);

    });

    
    test('Submit form with mobile number less than 10 digits @TC-11', async () => {

        await reg.fillRequiredFields({
            ...testData.validUser,
            email: testData.invalidMobile.short
        });

        await reg.submitBtn.click();
        await expect(reg.successModal).not.toBeVisible();

    });

  
    test('Submit form with invalid email format @TC-12', async () => {

        await reg.fillRequiredFields({
            ...testData.validUserWithEmail,
            email: testData.invalidEmail
        });

        await reg.submitBtn.click();
        await expect(reg.successModal).not.toBeVisible();
    });

  
    test('Special characters in mobile @TC-13', async () => {

        await reg.fillRequiredFields({
            ...testData.validUser,
            mobileNb: testData.invalidMobile.withSpecialChars
        });

        await reg.submitBtn.click();
        await expect(reg.successModal).not.toBeVisible();
    });


    test('Letters mixed in mobile @TC-14', async () => {

        await reg.fillRequiredFields({
            ...testData.validUser,
            mobileNb: testData.invalidMobile.withLetters
        });

        await reg.submitBtn.click();
        await expect(reg.successModal).not.toBeVisible();
    });

});