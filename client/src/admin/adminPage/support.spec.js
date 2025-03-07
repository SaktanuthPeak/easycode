const { test, expect } = require('@playwright/test');

test('test support page', async ({ page }) => {
    await page.goto('http://localhost:3000/home-preview');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('admintest');
    await page.getByRole('textbox', { name: 'Enter Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Password' }).fill('123456');
    await page.locator('form').getByRole('button', { name: 'Login', exact: true }).click();

    //broadcast message
    await page.getByRole('button', { name: 'Support', exact: true }).click();
    await page.getByRole('button', { name: 'Send Message 📤' }).click();
    await page.waitForSelector('div.fixed.inset-0');
    await page.getByPlaceholder('Type your message...').click();
    await page.getByPlaceholder('Type your message...').fill('Test message from admin');
    await page.getByRole('button', { name: 'Send to All' }).click();

});
