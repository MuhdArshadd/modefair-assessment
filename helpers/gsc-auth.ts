import { Page } from '@playwright/test';

export async function loginToGSC(page: Page) {
  const phone = process.env.GSC_PHONE;
  const password = process.env.GSC_PASSWORD;

  if (!phone || !password) {
    throw new Error(
      'GSC_PHONE and GSC_PASSWORD must be configured in the .env file'
    );
  }

  await page.locator('#phoneNo').fill(phone);
  await page.locator('#password').fill(password);

  await page
    .getByRole('button', { name: 'Login' })
    .click();
}