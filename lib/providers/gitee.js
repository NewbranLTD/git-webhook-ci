/**
 * Gitee implementation
 */
const { EventEmitter } = require('events');
const log = require('../lib/log');
/**
 * Main
 */
class GiteeHandler extends EventEmitter {
  constructor(req, res, errorHandler) {
    super();
    // We return an object here?
    this.errorHandler = errorHandler;
    return this.listener(req, res);
  }

  /**
   * Main method
   */
  listener(req, res) {
    log('req', req);
    // log('res', res);
  }
}

module.exports = GiteeHandler;
