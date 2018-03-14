/**
 * Gitee implementation
 */
const BaseTools = require('./base-tools.js');
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
}

module.exports = GiteeHandler;
