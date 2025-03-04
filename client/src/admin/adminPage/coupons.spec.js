import { test, expect } from '@playwright/test';

test('test Create coupon', async ({ page }) => {
  await page.goto('http://localhost:3000/home-preview');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admintest');
  await page.getByRole('textbox', { name: 'Enter Password' }).click();
  await page.getByRole('textbox', { name: 'Enter Password' }).fill('123456');
  await page.locator('form').getByRole('button', { name: 'Login', exact: true }).click();
  await page.getByRole('button', { name: 'Coupons' }).click();
  await page.getByRole('button', { name: 'Create New Coupon' }).click();
  await page.getByRole('textbox', { name: 'Coupon Code' }).click();
  await page.getByRole('textbox', { name: 'Coupon Code' }).fill('666');
  await page.getByRole('spinbutton', { name: 'Discount (%)' }).click();
  await page.getByRole('spinbutton', { name: 'Discount (%)' }).fill('66');
  await page.locator('#startDate').fill('2025-03-02');
  await page.getByRole('textbox', { name: 'Start Date Expiration Date' }).fill('2025-03-26');
  await page.getByRole('button', { name: 'Create Coupon' }).click();
});