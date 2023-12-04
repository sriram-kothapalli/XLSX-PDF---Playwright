# How to Validate Excel and PDF Data with PostgreSQL using Playwright


## Overview

This project Uses Playwright tool, an open-source end-to-end testing framework, serves as a powerful tool for automating web applications. In this guide, we'll explore how to leverage Playwright to validate data seamlessly across Excel and PDF formats, comparing it with information stored in a PostgreSQL database. This process ensures accuracy and consistency in your data verification efforts. Let's dive into the step-by-step approach to achieve this comprehensive validation.


## Programming Language 

   `JavaScript`


## Limitations
Certainly, here are two potential limitations when validating XLSX (Excel) and PDF files using Playwright:
 
1. Limited Native Support for File Formats:
   - Playwright primarily focuses on interacting with web elements. While it can download files, its native support for parsing and validating complex file formats like XLSX and PDF is limited. You may need to rely on external libraries for in-depth file processing.
 
2. Parsing Challenges for PDF Files:
   - PDF files can be challenging to parse accurately due to their diverse structures. Playwright may struggle to provide precise text extraction from all types of PDFs, especially those with complex layouts or embedded images.


## Playwright Project Folder Structure

|-- Database
  |-- database-setup.js      **Configuration for PostgreSQL connection setup**
|-- downloads
  |-- file.xlsx              **Downloaded XLSX file**
  |-- file.pdf               **Downloaded PDF file**
|-- POM
  |-- File.js                **Page Object Model for handling XLSX and PDF validation**
|-- tests
  |-- test.spec.js           **Test cases for XLSX and PDF files**
|-- playwright.config.js     **Environment configurations for Playwright**




## Prerequisites

Before initiating the tests, ensure the following dependencies are installed:

- **Node.js:** Install from [https://nodejs.org/]
- **npm (Node Package Manager):** Included with Node.js installation.

## Setup

1. Clone the repository:

    `git clone https://github.com/sriram-kothapalli/XLSX-PDF---Playwright.git`

2. Navigate to the project directory:

    `cd PlayWright`

3. Install project dependencies:

    `npm install`

## Run a set of tests

1. Please navigate to the `package.json` file where you can find the scripts to a run spec.



**Thank you for setting up the project! If you have any further questions or concerns, feel free to reach out. Happy testing!** 🚀🤗