const nodemailer = require('nodemailer');
const logger = require('./logger');
const EmailGenerator = require('./emailGenerator');

class GmailClient {
  constructor(user, pass, port) {
    this.user = user;
    this.transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
  }

  async verifyConnection() {
    return new Promise((res, rej) => {
      this.transport.verify((error, success) => {
        if (error) {
          rej(error);
        } else {
          logger.debug('mail server connected');
          res(success);
        }
      });
    });
  }

  async sendNotificationEmail(notifications) {
    logger.debug({ notifications }, `sending notifications to: ${this.user}`);
    const generator = new EmailGenerator();
    notifications.forEach((notification) => {
      generator.addListing(notification);
    });

    const mailOptions = {
      from: this.user,
      to: this.user,
      subject: 'Discogs Listing Alert',
      text: generator.toString(),
      // html: generator.toString(),
    };
    return new Promise((res, rej) => {
      this.transport.sendMail(mailOptions, (err, response) => {
        if (err) {
          rej(err);
        } else {
          res(response);
        }
      });
    });
  }
}

module.exports = GmailClient;
