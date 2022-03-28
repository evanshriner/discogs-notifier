const process = require('process');
const { clearInterval } = require('timers');
const config = require('./config');
const logger = require('./src/logger');

const DiscogsAPIClient = require('./src/discogsAPIClient');
const DiscogsWebClient = require('./src/discogsWebClient');

const InMemoryStore = require('./src/inMemoryStore');

const discogsAPIClient = new DiscogsAPIClient(
  config.DISCOGS_API_BASE_URL,
  config.DISCOGS_USER_AGENT,
);
const discogsWebClient = new DiscogsWebClient(
  config.DISCOGS_WEB_BASE_URL,
);
const inMemoryStore = new InMemoryStore();

let pid;

async function run() {
  logger.debug({ config }, 'deployed config');
  Object.keys(config).forEach((key) => {
    // this will fail if any falsy values are added to the config
    if (!config[key]) {
      logger.error(`${key} needs to be defined`);
      throw new Error('fatal exception');
    }
  });
  // connect to mailer

  pid = setInterval(async () => {
    const list = (await discogsAPIClient.getList(config.DISCOGS_LIST)).items;
    const promises = await Promise.allSettled(list.map(async (release) => {
      const history = inMemoryStore.get(release.id);
      if (!history) {
        inMemoryStore.set(release.id, {
          listings: {},
          ...release,
        });
        logger.info(`new release added to tracker from list ${release.display_title}`);
        return Promise.resolve();
      }

      const listings = await discogsWebClient.getListingsForRelease(release.id);
      if (!listings) {
        logger.debug(`release ${release.id} does not have any listings right now`);
        return Promise.resolve();
      }
      const newListings = [];
      listings.forEach((listing) => {
        if (!history.listings[listing.id]
          || (history.listings[listing.id].price.base !== listing.price.base)) {
          history.listings[listing.id] = listing;
          newListings.push(listing);
        }
      });

      if (newListings.length) {
        return Promise.resolve({
          name: release.display_title,
          listingPath: `${config.DISCOGS_WEB_BASE_URL}${newListings[0].id}`,
          releasePath: `${config.DISCOGS_WEB_BASE_URL}/sell/release/${release.id}`,
          totalNewListings: newListings.length,
        });
      }
    }));

    // go through all settled, log out errors, aggregate successes and send to gmail server
    logger.debug('completed loop');
  }, config.UPDATE_INTERVAL * 1000);
}

if (require.main === module) {
  (async () => {
    try {
      process.on('SIGINT', () => {
        clearInterval(pid);
      });

      await run();
    } catch (e) {
      console.error(e);
      process.kill(process.pid, 'SIGINT');
    }
  })();
}
