const logger = require('./logger');

class InMemoryStore {
  constructor() {
    this.map = new Map();
  }

  set(key, value) {
    logger.debug({ key, value }, 'adding value to store');
    this.map.set(key, JSON.stringify(value));
  }

  get(key) {
    logger.debug(`getting ${key} from store`);
    const item = this.map.get(key) ? JSON.parse(this.map.get(key)) : null;
    logger.debug({ data: item }, 'retrieved value from store');
    return item;
  }
}

module.exports = InMemoryStore;
