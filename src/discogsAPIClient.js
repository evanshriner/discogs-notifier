const axios = require('axios');
const logger = require('./logger');

class DiscogsAPIClient {
  constructor(baseUrl, userAgent) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'User-Agent': userAgent,
      },
    });
  }

  async getList(listId) {
    logger.debug(`requesting discogs list ${listId}`);
    const list = (await this.client.get(`/lists/${listId}`)).data;
    logger.debug({ data: list }, 'successfully retrieved discogs list');
    return list;
  }
}

module.exports = DiscogsAPIClient;
