const process = require('process');
const config = require('./config');

const DiscogsAPIClient = require('./src/discogsAPIClient');

const discogsAPIClient = new DiscogsAPIClient(
  config.DISCOGS_BASE_URL,
  config.USER_AGENT,
);

async function run() {
  // ensure variables are set

  // connect to redis

  // connect to mailer

  // initial request to store list details

  const list = await discogsAPIClient.getList(config.DISCOGS_LIST);

  // loop on interval
//   setInterval(() => {
//    // anything that happens in here wont bubble up, so be sure to log errors
//   }, config.UPDATE_INTERVAL * 1000);
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
