require('dotenv').config({ path: '/.env.local' });
const process = require('process');

module.exports = {
  DISCOGS_BASE_URL: 'https://api.discogs.com',
  DISCOGS_USERNAME: process.env.DISCOGS_USERNAME,
  DISCOGS_LIST: process.env.DISCOGS_LIST || 'wantlist',
};
