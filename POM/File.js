import fs from 'fs/promises';
import XLSX from 'xlsx';
import pdfParse from 'pdf-parse';
import { postgreSQL } from '../Database/database-setup';
const { expect } = require('@playwright/test');

export const downloadFile = async (page, fileType) => {
  await page.waitForTimeout(4000);
  const buttonName = `EXPORT ${fileType === 'pdf' ? 'PDF' : 'XLSX'}`;
  await page.getByRole('button', { name: buttonName }).click({ timeout: 10000 });
  const download = await page.waitForEvent('download', { timeout: 90000 });
  await download.saveAs(`./downloads/file.${fileType}`);
};

export const readFileContent = async ({ extension, filePath }) => {
  const fileContent = await fs.readFile(filePath);
  if (extension === 'xlsx') {
    const workbook = XLSX.read(fileContent, { type: 'buffer' });
    const sheetData = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheetData, { header: 1 });
    await fs.unlink(filePath); // Delete xlsx file
    return jsonData;
  } else if (extension === 'pdf') {
    const dataBuffer = Buffer.from(fileContent);
    const data = await pdfParse(dataBuffer);
    await fs.unlink(filePath); // Delete pdf file
    return data.text;
  }
};

export class FILES {
  async XLSX(page) {
    await downloadFile(page, 'xlsx');
    const jsonData = await readFileContent({ extension: 'xlsx', filePath: './downloads/file.xlsx' });
    const result = await postgreSQL(`SELECT sampleid, method, operator, devicename, comments, serialnumber FROM device WHERE serial_number`);
    const testData = [
      { actual: `${jsonData[3][1]} ${jsonData[4][1]}`, expected: `Sample ID ${result.sampleid}` },
      { actual: `${jsonData[3][2]} ${jsonData[4][2]}`, expected: `Equipment Method ${result.method}` },
      { actual: `${jsonData[3][3]} ${jsonData[4][3]}`, expected: `User ISID ${result.operator}` },
      { actual: `${jsonData[3][5]} ${jsonData[4][5]}`, expected: `Equipment Name ${result.devicename}` },
      { actual: `${jsonData[3][6]} ${jsonData[4][6]}`, expected: `Run Comment ${result.comments}` },
      { actual: jsonData[5][0], expected: 'Equipment Information' },
      { actual: `${jsonData[6][6]} ${jsonData[6][7]}`, expected: `Serial # ${result.serialnumber}` },
    ];
    testData.forEach((data) => {
      expect(data.actual).toEqual(data.expected);
    });
    console.table(testData);
  }

  async PDF(page) {
    await downloadFile(page, 'pdf');
    const pdfText = await readFileContent({ extension: 'pdf', filePath: './downloads/file.pdf' });
    const result = await postgreSQL(`SELECT sampleid, method, operator, devicename, comments, serialnumber FROM device WHERE serial_number`);
    expect(pdfText).toContain(`Sample ID ${result.sampleid}`);
    expect(pdfText).toContain(`Equipment Method ${result.method}`);
    expect(pdfText).toContain(`User ISID ${result.operator}`);
    expect(pdfText).toContain(`Equipment Name ${result.devicename}`);
    expect(pdfText).toContain(`Run Comment ${result.comments}`);
    expect(pdfText).toContain('Equipment Information');
  }
}