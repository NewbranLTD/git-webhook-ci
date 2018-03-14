/**
 * Share the reusable methods here for subclassing
 */
const EventEmitter = require('events');

class BaseTools extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  /**
   * Extract the json payload
   * @param {object} req the request Object
   * @return {object} Promise
   */
  _parsePayload(req) {
    return new Promise(resolver => {
      let body = [];
      req
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          body = Buffer.concat(body).toString();
          // At this point, `body` has the entire request body stored in it as a string
          resolver(JSON.parse(body));
        });
    });
  }

  /**
   * @param {object} res the respond object
   * @param {string} msg to throw
   * @return {null} nothing
   */
  _resError(res, msg) {
    res.writeHead(400, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        error: msg
      })
    );
    this.emit('error', new Error(msg));
  }
}

module.exports = BaseTools;
