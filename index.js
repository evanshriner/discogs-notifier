const process = require('process');
const { clearInterval } = require('timers');
const config = require('./config');
const logger = require('./src/logger');

const DiscogsAPIClient = require('./src/discogsAPIClient');
const DiscogsWebClient = require('./src/discogsWebClient');

const InMemoryStore = require('./src/inMemoryStore');
const GmailClient = require('./src/gmailClient');

const discogsAPIClient = new DiscogsAPIClient(
  config.DISCOGS_API_BASE_URL,
  config.DISCOGS_USER_AGENT,
);
const discogsWebClient = new DiscogsWebClient(
  config.DISCOGS_WEB_BASE_URL,
);
const gmailClient = new GmailClient(
  config.GMAIL_EMAIL,
  config.GMAIL_PASSWORD,
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

  await gmailClient.verifyConnection();

  pid = setInterval(async () => {
    try {
      const list = (await discogsAPIClient.getList(config.DISCOGS_LIST)).items;
      const promises = await Promise.allSettled(list.map(async (release) => {
        const history = inMemoryStore.get(release.id);
        if (!history) {
          inMemoryStore.set(release.id, {
            listings: ((await discogsWebClient.getListingsForRelease(release.id)) || [])
              .reduce((acc, listing) => ({
                ...acc,
                [listing.id]: listing,
              }), {}),
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
          inMemoryStore.set(release.id, {
            listings: history.listings,
            ...release,
          });

          const aggregate = {
            name: release.display_title,
            condition: newListings[0].condition,
            shipsFrom: newListings[0].shipsFrom,
            price: newListings[0].price,
            listingPath: `${config.DISCOGS_WEB_BASE_URL}${newListings[0].id}`,
            releasePath: `${config.DISCOGS_WEB_BASE_URL}/sell/release/${release.id}`,
            totalNewListings: newListings.length,
          };
          logger.info({ aggregate }, 'new listings found');
          return Promise.resolve(aggregate);
        }
      }));

      promises.filter((promise) => promise.status === 'rejected').forEach((reject) => {
        logger.error(`error occured when trying to update a release in the list: ${reject.reason}`);
      });
      const notifications = promises.filter(
        (promise) => promise.status === 'fulfilled' && promise.value != null,
      ).map((promise) => promise.value);

      if (notifications.length) {
        await gmailClient.sendNotificationEmail(notifications);
        logger.info({ notifications }, 'successfully sent email for new listings');
      } else {
        logger.debug('no new notifications to be sent this iteration');
      }
      logger.debug('completed iteration');
    } catch (e) {
      logger.error(e, 'error occurred inside iteration');
    }
  }, config.UPDATE_INTERVAL * 1000);
  logger.info('started discogs-notifier');
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
