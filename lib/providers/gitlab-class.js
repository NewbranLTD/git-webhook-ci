/**
 * Gitlab base class
 */
const BaseTools = require('./base-tools');
/**
 * Main
 */
class GitlabHandler extends BaseTools {
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
      const headers = req.headers; // JSON.stringify(req.headers, replacer);
      // cache = null;
      this._verify(payload, headers)
        .then(payload => {
          this._resSuccess(res, req, payload);
        })
        .catch(err => {
          this._resError(res, req, err);
        });
    });
  }

  /**
   * Verify the password field
   * @param {object} payload Content
   * @param {object} headers headers looking for the X-Gitlab-Event: Push Hook
   * @return {object} promise
   */
  _verify(payload, headers) {
    const eventName = 'X-Gitlab-Event'.toLowerCase();
    const token = 'X-Gitlab-Token'.toLowerCase();
    // Console.log('headers', headers, typeof headers);
    return new Promise((resolver, rejecter) => {
      if (headers[eventName] === 'Push Hook' && headers[token] === this.options.secret) {
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
  _resSuccess(res, req, payload) {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end('{"ok":true}');
    // Check the result if this is what we wanted
    if (payload.object_kind === 'push') {
      this.emit('push', {
        payload: payload,
        host: req.headers.host,
        event: payload.object_kind
      });
    } else {
      this.emit('error', {
        msg: 'Not the event we are expecting',
        event: payload.object_kind
      });
    }
  }
}
// Export
module.exports = GitlabHandler;
