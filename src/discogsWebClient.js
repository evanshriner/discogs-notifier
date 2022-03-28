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

    // todo: tbody can be null, if you add something that is not currently selling.
    const tBody = (rootHtml.querySelector('.mpitems'))?.getElementsByTagName('tbody');

    if (tBody) {

    }
    logger.debug(`found ${items.length} listings in page`);

    return items.map((item) => {
      const itemCondition = item.querySelector('.item_description')
        .querySelector('.item_condition');
      const itemPrice = item.querySelector('.item_price');
      const mappedItem = {
        condition: {
          media: (itemCondition.getElementsByTagName('span')[2]).text.replace(/^\s+|\s+$|\n/g, ''),
          sleeve: itemCondition.querySelector('.item_sleeve_condition') ? itemCondition.querySelector('.item_sleeve_condition').text : null,
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
