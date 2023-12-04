// Import the Playwright configuration from the '../playwright.config' file
import config from '../playwright.config';
// Import the 'Client' class from the 'pg' library
const { Client } = require('pg');
// Create a new instance of the 'Client' class with PostgreSQL configuration from the Playwright config
const client = new Client(config.DB);

// Define a function to execute a PostgreSQL query
export const postgreSQL = async (sqlQuery) => {
  try {
    // Connect to the PostgreSQL database
    await client.connect();
    // Execute the SQL query and store the result
    const result = await client.query(sqlQuery);
    // Return the first row of the result
    return result.rows[0];
  } finally {
    // Ensure that the PostgreSQL client is closed, regardless of success or failure
    await client.end();
  }
};
