/**
 * Gitee implementation
 */
const BaseTools = require('../lib/base-tools');
/**
 * Main
 */
class GiteeHandler extends BaseTools {
  constructor(options) {
    super(options);
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
