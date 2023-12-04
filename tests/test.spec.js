const { test } = require('@playwright/test');
import { FILES } from '../POM/File';
const download = new FILES()

test('Verify XLSX DATA ', async ({ page }) => {
  await page.goto('/');
  await download.XLSX(page)
});

test('Verify PDF DATA ', async ({ page }) => {
  await page.goto('/');
  await download.PDF(page)
});