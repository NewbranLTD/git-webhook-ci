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

  /**
   * @param {object} res the respond
   * @param {object} result the payload
   * @return {null} nothing
   */
  _resSuccess(res, req, result) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end('{"ok":true}');
    // Check the result if this is what we wanted
    if (result.hook_name === 'push_hooks') {
      this.emit('push', {
        payload: result,
        host: req.headers.host,
        event: result.hook_name
      });
    } else {
      this.emit('error', {
        msg: 'Not the event we are expecting',
        event: result.hook_name
      });
    }
  }
}

module.exports = BaseTools;
