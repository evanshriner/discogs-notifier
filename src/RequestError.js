class RequestError extends Error {
  constructor(message, data, code) {
    super(message);
    this.message = message;
    if (data) {
      this.data = data;
    }
    if (code) {
      this.code = code;
    }
  }
}

module.exports = RequestError;
