import config from '../playwright.config';
const { Client } = require('pg');
const client = new Client(config.DB);

export const postgreSQL = async (sqlQuery) => {
  try {
    await client.connect();
    const result = await client.query(sqlQuery);
    return result.rows[0];
  } finally {
    await client.end(); // Ensure the client is closed
  }
};
