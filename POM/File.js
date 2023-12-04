// Import the 'fs' module with promises support for file system operations
import fs from 'fs/promises';
// Import the 'xlsx' library for working with Excel files
import XLSX from 'xlsx';
// Import the 'pdf-parse' library for parsing text from PDF files
import pdfParse from 'pdf-parse';
// Import the PostgreSQL connection setup from the '../Database/database-setup' file
import { postgreSQL } from '../Database/database-setup';
// Import the 'expect' function from the '@playwright/test' library
const { expect } = require('@playwright/test');

// Define a function to download a file from the provided page and save it with the specified fileType
export const downloadFile = async (page, fileType) => {
  // Wait for 4 seconds
  await page.waitForTimeout(4000);
  // Build the button name based on the fileType and click it on the page
  const buttonName = `EXPORT ${fileType === 'pdf' ? 'PDF' : 'XLSX'}`;
  await page.getByRole('button', { name: buttonName }).click({ timeout: 10000 });
  // Wait for the 'download' event with a timeout of 90 seconds and save the downloaded file
  const download = await page.waitForEvent('download', { timeout: 90000 });
  await download.saveAs(`./downloads/file.${fileType}`);
};

// Define a function to read the content of a file based on its extension and filePath
export const readFileContent = async ({ extension, filePath }) => {
  // Read the content of the file
  const fileContent = await fs.readFile(filePath);
  if (extension === 'xlsx') {
    // If the extension is 'xlsx', process the Excel file content
    const workbook = XLSX.read(fileContent, { type: 'buffer' });
    const sheetData = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheetData, { header: 1 });
    // Delete the xlsx file
    await fs.unlink(filePath);
    return jsonData;
  } else if (extension === 'pdf') {
    // If the extension is 'pdf', process the PDF file content
    const dataBuffer = Buffer.from(fileContent);
    const data = await pdfParse(dataBuffer);
    // Delete the pdf file
    await fs.unlink(filePath);
    return data.text;
  }
};

// Define a class named 'FILES' with methods for handling XLSX and PDF files
export class FILES {
  // Method to handle XLSX files
  async XLSX(page) {
    // Download XLSX file from the page
    await downloadFile(page, 'xlsx');
    // Read and process the content of the downloaded XLSX file
    const jsonData = await readFileContent({ extension: 'xlsx', filePath: './downloads/file.xlsx' });
    // Query PostgreSQL database to retrieve data
    const result = await postgreSQL(`SELECT sampleid, method, operator, devicename, comments, serialnumber FROM device WHERE serial_number`);
    // Define test data for comparison
    const testData = [
      { actual: `${jsonData[3][1]} ${jsonData[4][1]}`, expected: `Sample ID ${result.sampleid}` },
      { actual: `${jsonData[3][2]} ${jsonData[4][2]}`, expected: `Equipment Method ${result.method}` },
      { actual: `${jsonData[3][3]} ${jsonData[4][3]}`, expected: `User ISID ${result.operator}` },
      { actual: `${jsonData[3][5]} ${jsonData[4][5]}`, expected: `Equipment Name ${result.devicename}` },
      { actual: `${jsonData[3][6]} ${jsonData[4][6]}`, expected: `Run Comment ${result.comments}` },
      { actual: jsonData[5][0], expected: 'Equipment Information' },
      { actual: `${jsonData[6][6]} ${jsonData[6][7]}`, expected: `Serial # ${result.serialnumber}` },
    ];
    // Assert expectations using the 'expect' function
    testData.forEach((data) => {
      expect(data.actual).toEqual(data.expected);
    });
    // Display the test data in a table
    console.table(testData);
  }

  // Method to handle PDF files
  async PDF(page) {
    // Download PDF file from the page
    await downloadFile(page, 'pdf');
    // Read and process the content of the downloaded PDF file
    const pdfText = await readFileContent({ extension: 'pdf', filePath: './downloads/file.pdf' });
    // Query PostgreSQL database to retrieve data
    const result = await postgreSQL(`SELECT sampleid, method, operator, devicename, comments, serialnumber FROM device WHERE serial_number`);
    // Assert expectations using the 'expect' function for PDF content
    expect(pdfText).toContain(`Sample ID ${result.sampleid}`);
    expect(pdfText).toContain(`Equipment Method ${result.method}`);
    expect(pdfText).toContain(`User ISID ${result.operator}`);
    expect(pdfText).toContain(`Equipment Name ${result.devicename}`);
    expect(pdfText).toContain(`Run Comment ${result.comments}`);
    expect(pdfText).toContain('Equipment Information');
  }
}
