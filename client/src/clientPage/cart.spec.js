import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/home-preview');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('peak2');
    await page.getByRole('textbox', { name: 'Enter Password' }).click();
    await page.getByRole('textbox', { name: 'Enter Password' }).fill('123456');
    await page.locator('form').getByRole('button', { name: 'Login', exact: true }).click();
    await page.getByRole('button', { name: 'All courses' }).click();
    await page.getByRole('img', { name: 'Front-End development with' }).click();
    await page.getByRole('button', { name: 'All courses' }).click();
    await page.getByRole('img', { name: 'Developing Back-End with MySql' }).click();
    await page.getByRole('button', { name: 'Add To Cart' }).click();
    await page.getByRole('button', { name: 'All courses' }).click();
    await page.getByRole('img', { name: 'Developing website with React' }).click();
    await page.getByRole('button', { name: 'Add To Cart' }).click();
    await page.getByRole('button', { name: 'All courses' }).click();
    await page.getByRole('img', { name: 'Python for data science' }).click();
    await page.getByRole('button', { name: 'Add To Cart' }).click();
});