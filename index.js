const process = require('process');
const { clearInterval } = require('timers');
const config = require('./config');
const logger = require('./src/logger');

const DiscogsAPIClient = require('./src/discogsAPIClient');
const DiscogsWebClient = require('./src/discogsWebClient');

const InMemoryStore = require('./src/inMemoryStore');

const discogsAPIClient = new DiscogsAPIClient(
  config.DISCOGS_API_BASE_URL,
  config.USER_AGENT,
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

  const list = (await discogsAPIClient.getList(config.DISCOGS_LIST)).items;
  if (list) {
    console.log(list);
  }

  // pid = setInterval(async () => {
  //   const list = (await discogsAPIClient.getList(config.DISCOGS_LIST)).items;
  //   await Promise.all(list.map(async (item) => {
  //     const history = inMemoryStore.get(item.id);
  //     if (!history) {
  //       inMemoryStore.set(item.id, item);
  //       logger.info(`new item added to tracker from list ${item.display_title}`);
  //       return Promise.resolve();
  //     }

  //     const listings = await discogsWebClient.getListingsForRelease(item.id);
  //     const ooo = listings;
  //     // notify, return email request as final promise
  //   }));
  //   // possibly use all settled to notify of errors with certain items.
  //   logger.debug('completed loop');
  // }, config.UPDATE_INTERVAL * 1000);
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
