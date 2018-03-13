/**
 * Gitee implementation
 */
const EventEmitter = require('events');
/**
 * Main
 */
class GiteeHandler extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  /**
   * Main method
   * @param {object} req the request
   * @param {object} res the respond
   * @param {function} callback res with 404
   * @return {null} nothing
   */
  handler(req, res, callback) {
    if (req.url.split('?').shift() !== this.options.path || req.method !== 'POST') {
      return callback(); // The only time we use the callback
    }
    this._parsePayload(req).then(payload => {
      this._verify(payload)
        .then(result => {
          this._resSuccess(res, req, result);
        })
        .catch(err => {
          this._resError(res, req, err);
        });
    });
  }

  /**
   * Verify the password field
   * @param {object} payload Content
   * @return {object} promise
   */
  _verify(payload) {
    return new Promise((resolver, rejecter) => {
      // Log('parsed payload', payload);
      if (payload.password === this.options.secret) {
        resolver(payload);
      } else {
        rejecter(new Error('Verify failed'));
      }
    });
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

module.exports = GiteeHandler;
