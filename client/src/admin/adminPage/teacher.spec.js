import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:3000/home-preview");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fil("admintest");
  await page.getByRole("textbox", { name: "Enter Password" }).click();
  await page.getByRole("textbox", { name: "Enter Password" }).fill("123456");
  await page.getByRole("textbox", { name: "Enter Password" }).press("Enter");
  await page
    .locator("form")
    .getByRole("button", { name: "Login", exact: true })
    .click();
  await page.getByRole("button", { name: "Teacher" }).click();
  await page
    .getByRole("row", { name: "2 thanakrit@gmail.com" })
    .getByRole("button")
    .nth(1)
    .click();
  await page
    .getByRole("checkbox", { name: "Python for data science" })
    .uncheck();
  await page
    .getByRole("checkbox", { name: "Developing website with React" })
    .check();
  await page
    .getByRole("checkbox", { name: "Developing Back-End with MySql" })
    .check();
  await page.getByRole("checkbox", { name: "Python for data science" }).check();
  await page.getByRole("button", { name: "บันทึก" }).click();
  await page
    .getByRole("row", { name: "2 thanakrit@gmail.com" })
    .getByRole("button")
    .first()
    .click();
  await page.getByRole("heading", { name: "Data science R basics" }).click();
  await page
    .getByRole("row", { name: "10 15@gmail.com ขุนเเผน มอ" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "ลบ" }).click();
});
