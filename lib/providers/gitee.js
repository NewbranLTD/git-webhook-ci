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
    this.callback = errorHandler;
    return this.listener(req, res);
  }

  /**
   * Main method
   */
  listener(req, res) {
    if (req.url.split('?').shift() !== options.path || req.method !== 'POST') {
      this.callback();
    }
    this.req = req;
    this.res = res;
    log('req', req);
    // log('res', res);
  }

  _errorHandler(msg) {
    this.res.writeHead(400, { 'content-type': 'application/json' });
    this.res.end(JSON.stringify({ error: msg }));
    const err = new Error(msg);
    this.emit('error', err, this.req);
    this.callback(err);
  }

  _success() {
    this.res.writeHead(200, { 'content-type': 'application/json' });
    this.res.end('{"ok":true}');
    /*
    Const emitData = {
        event   : event
      , id      : id
      , payload : obj
      , protocol: req.protocol
      , host    : req.headers['host']
      , url     : req.url
    }
    this.emit('success', emitData);
    */
  }
}

module.exports = GiteeHandler;
