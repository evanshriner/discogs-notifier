const { parse } = require('node-html-parser');
const axios = require('axios');
const logger = require('./logger');
const RequestError = require('./RequestError');

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36';
class DiscogsWebClient {
  constructor(baseUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
      // needed to fool the item limit
      headers: { 'User-Agent': USER_AGENT },
      responseType: 'document',
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

  async getListingsForRelease(releaseId) {
    logger.debug(`querying discogs marketplace for releaseId ${releaseId}`);
    const rootHtml = parse((await this.client.get(
      `/sell/release/${releaseId}?sort=price%2Casc&limit=250`,
      { transformResponse: (res) => res },
    )));

    const items = (rootHtml.querySelector('.mpitems'))
      .getElementsByTagName('tbody')[0]
      .getElementsByTagName('tr');
    if (!items.length) {
      return null;
    }

    logger.debug(`found ${items.length} listings in page`);

    return items.map((item) => {
      const itemDescription = item.querySelector('.item_description');
      const itemId = itemDescription
        .getElementsByTagName('strong')[0]
        .getElementsByTagName('a')[0]
        .getAttribute('href');
      const itemCondition = itemDescription.querySelector('.item_condition');
      const itemPrice = item.querySelector('.item_price');
      const mappedItem = {
        id: itemId,
        condition: {
          media: (itemCondition.getElementsByTagName('span')[2]).text.replace(/^\s+|\s+$|\n/g, ''),
          sleeve: itemCondition.querySelector('.item_sleeve_condition') ? itemCondition.querySelector('.item_sleeve_condition').text : 'N/A',
        },
        shipsFrom: item.querySelector('.seller_info')
          .getElementsByTagName('ul')[0]
          .getElementsByTagName('li')[2]
          .lastChild.text,
        price: {
          base: itemPrice.querySelector('.price').text,
        },
      };
      logger.debug({ data: mappedItem }, 'generated json listing');
      return mappedItem;
    });
  }
}

module.exports = DiscogsWebClient;
