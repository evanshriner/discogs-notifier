require('dotenv').config({ path: './.env.local' });
const process = require('process');

module.exports = {
  DISCOGS_API_BASE_URL: 'https://api.discogs.com',
  DISCOGS_WEB_BASE_URL: 'https://www.discogs.com',
  GMAIL_EMAIL: process.env.GMAIL_EMAIL,
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
  DISCOGS_USER_AGENT: `${process.env.GMAIL_EMAIL}Notifier/1.0`,
  DISCOGS_LIST: process.env.DISCOGS_LIST,
  COUNTRY_FILTER: process.env.COUNTRY_FILTER || 'none',
  UPDATE_INTERVAL: process.env.UPDATE_INTERVAL || 10,
  NOTIFIER_LOG_LEVEL: process.env.NOTIFIER_LOG_LEVEL || 'info',
};
