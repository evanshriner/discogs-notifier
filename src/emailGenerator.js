class EmailGenerator {
  constructor() {
    this.body = 'Hello there,\n\nSome new listings have been added to the marketplace:\n\n\n\n';
  }

  addListing(listing) {
    this.body = this.body.concat(`Release: ${listing.name}\n\nCondition:\nMedia: ${listing.condition.media}\nSleeve: ${listing.condition.sleeve}\n\nShips From: ${listing.shipsFrom}\nPrice: ${listing.price.base}\n${listing.listingPath}\n\n\n\n`);
  }

  toString() {
    return this.body;
  }
}

module.exports = EmailGenerator;
