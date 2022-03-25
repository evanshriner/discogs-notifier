const logger = require('./logger');

class InMemoryStore {
  constructor() {
    this.map = new Map();
  }

  set(key, value) {
    logger.debug({ key, value }, 'adding value to store');
    this.map.set(key, value);
  }

  get(key, value) {
    logger.debug({ key, value }, 'getting value from store');
    const item = this.map.get(key);
    logger.debug({ data: item }, 'retrieved value from store');
    return item;
  }
}

module.exports = InMemoryStore;
