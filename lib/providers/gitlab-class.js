/**
 * Gitlab base class
 */
const EventEmitter = require('events');
/**
 * Main
 */
class GitlabHandler extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }
  // @TODO
}
// Export
module.exports = GitlabHandler;
