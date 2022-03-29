const pino = require('pino');
const config = require('../config');

module.exports = pino({
  level: config.NOTIFIER_LOG_LEVEL || 'info',
});
