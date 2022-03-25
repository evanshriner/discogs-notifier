const process = require('process');
const config = require('./config');
const logger = require('./src/logger');

const DiscogsAPIClient = require('./src/discogsAPIClient');
const InMemoryStore = require('./src/inMemoryStore');

const discogsAPIClient = new DiscogsAPIClient(
  config.DISCOGS_BASE_URL,
  config.USER_AGENT,
);
const inMemoryStore = new InMemoryStore();

async function run() {
  // ensure variables are set
  Object.keys(config).forEach((key) => {
    // this will fail if any falsy values are added to the config
    logger.debug();
    if (!config[key]) {
      logger.error(`${key} needs to be defined`);
      throw new Error('fatal exception');
    }
  });
  // connect to redis

  // connect to mailer

  setInterval(async () => {
    (await discogsAPIClient.getList(config.DISCOGS_LIST)).items.map((item) => {

    },
      // check in memory store for item
      // if not present, add it and be done
      // if present

      // go to discogs web and get all items and prices, sort by lowest price
      // take all items that fit price definition

    );
  }, config.UPDATE_INTERVAL * 1000);
}

if (require.main === module) {
  (async () => {
    try {
      process.on('SIGINT', () => {
        // any graceful shutdown proceses
      });

      await run();
    } catch (e) {
      console.error(e);
      process.kill(process.pid, 'SIGINT');
    }
  })();
}
