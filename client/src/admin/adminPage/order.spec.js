import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/home-preview');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admintest');
  await page.getByRole('textbox', { name: 'Enter Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('123456');
  await page.locator('form').getByRole('button', { name: 'Login', exact: true }).click();
  await page.getByRole('button', { name: 'Order' }).click();
  await page.getByRole('row', { name: '04-03-2025 21:48 peak2' }).getByRole('button').first().click();
  await page.getByRole('row', { name: '09-02-2025 01:27 peak' }).getByRole('button').nth(1).click();
  await page.getByRole('button', { name: 'Courses' }).click();
  await page.locator('div:nth-child(2) > div > button').first().click();
  await page.getByRole('button', { name: 'Courses', exact: true }).click();
  await page.locator('.p-4 > div > button:nth-child(2)').first().click();
  await page.getByRole('button', { name: 'Courses', exact: true }).click();
  await page.locator('div:nth-child(3) > .p-4 > div > button:nth-child(2)').click();
  await page.getByRole('button', { name: 'Courses', exact: true }).click();
  await page.locator('.grid > div:nth-child(2) > .p-4 > div > button').first().click();
  await page.getByRole('button', { name: 'Courses', exact: true }).click();
  await page.locator('div:nth-child(2) > .p-4 > div > button:nth-child(2)').click();
});