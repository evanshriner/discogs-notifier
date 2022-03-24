const process = require('process');
const RequestHandler = require('./src/requestHandler');

async function run() {

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
