const axios = require('axios');
const logger = require('./logger');
const RequestError = require('./RequestError');

class DiscogsAPIClient {
  constructor(baseUrl, userAgent) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'User-Agent': userAgent,
      },
    });
    this.client.interceptors.response.use(
      (response) => response.data,
      ({ response, message }) => Promise.reject(
        new RequestError(
          message,
          response ? response.data : undefined,
          response ? response.status : undefined,
        ),
      ),
    );
  }

  async getList(listId) {
    logger.debug(`requesting discogs list ${listId}`);
    const list = (await this.client.get(`/lists/${listId}`));
    logger.debug({ data: list }, 'successfully retrieved discogs list');
    return list;
  }
}

module.exports = DiscogsAPIClient;
