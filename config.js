require('dotenv').config({ path: './.env.local' });
const process = require('process');

module.exports = {
  DISCOGS_BASE_URL: 'https://api.discogs.com',
  DISCOGS_USERNAME: process.env.DISCOGS_USERNAME,
  DISCOGS_USER_AGENT: `${process.env.DISCOGS_USERNAME}Notifier/1.0`,
  DISCOGS_LIST: process.env.DISCOGS_LIST,
  UPDATE_INTERVAL: process.env.UPDATE_INTERVAL || 5,
};
