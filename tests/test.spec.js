// Import the 'test' function from the '@playwright/test' library
const { test } = require('@playwright/test');
// Import the 'FILES' class from the '../POM/File' file
import { FILES } from '../POM/File';
// Create an instance of the 'FILES' class
const download = new FILES();

// Test to verify XLSX data
test('Verify XLSX DATA ', async ({ page }) => {
  // Navigate to the root URL
  await page.goto('/');
  // Call the 'XLSX' method from the 'FILES' class to handle XLSX files
  await download.XLSX(page);
});

// Test to verify PDF data
test('Verify PDF DATA ', async ({ page }) => {
  // Navigate to the root URL
  await page.goto('/');
  // Call the 'PDF' method from the 'FILES' class to handle PDF files
  await download.PDF(page);
});
