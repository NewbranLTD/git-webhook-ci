/**
 * Gitee implementation
 */
const { EventEmitter } = require('events');
/**
 * Main
 */
class GiteeHandler extends EventEmitter {
  constructor(req, res, errorHandler) {
    super();
    // We return an object here?
    this.errorHandler = errorHandler;
    return this.listner(req, res);
  }
  /**
   * main method
   */
  listener(req, res) {

  }
}

module.exports = GiteeHandler;
