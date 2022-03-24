const process = require('process');
const DiscogsClient = require('./src/discogsClient');
const config = require('./config');

const discogsClient = new DiscogsClient(config.DISCOGS_BASE_URL);

async function run() {
  // connect to redis

  // connect to mailer

  // initial request to store list details

  

  // loop on interval 
  setInterval(() => {
   // anything that happens in here wont bubble up, so be sure to log errors
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
