const pino = require('pino');
const config = require('../config');

module.exports = pino({
  level: config.LOG_LEVEL || 'info',
});
