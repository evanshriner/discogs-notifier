const { parse } = require('node-html-parser');
const axios = require('axios');
const logger = require('./logger');

class DiscogsWebClient {
  constructor(baseUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
      responseType: 'document',
    });
  }

  async getListingsForItem(itemId) {
    logger.debug(`querying discogs marketplace for itemId ${itemId}`);
    const html = parse((await this.client.get(
      `/sell/release/${itemId}?sort=price%2Casc&limit=250&page=1`,
    )).data);
    logger.debug({ data: html }, 'successfully retrieved discogs page html');
    return html;
  }
}

module.exports = DiscogsWebClient;
