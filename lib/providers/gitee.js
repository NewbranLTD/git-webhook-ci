/**
 * Gitee implementation
 */
const EventEmitter = require('events');
// const { URL } = require('url');
const log = require('../log');
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
   */
  handler(req, res, callback) {
    if (req.url.split('?').shift() !== this.options.path || req.method !== 'POST') {
      callback();
    }
    this._parsePayload(req).then(payload => {
      this._verify(payload)
        .then(result => {
          this._resSuccess(res, result, callback);
        })
        .catch(err => {
          this._resError(res, req, err, callback);
        });
    });
  }

  _verify(payload) {
    log('parsed payload', payload);
  }

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
          resolver(body);
        });
    });
  }

  _resError(res, req, msg, callback) {
    res.writeHead(400, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        error: msg
      })
    );
    const err = new Error(msg);
    this.emit('error', err, req);
    callback(err);
  }

  _resSuccess(res, result, callback) {
    res.writeHead(200, {'content-type': 'application/json'});
    res.end('{"ok":true}');
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
    callback('success');
  }
}

module.exports = GiteeHandler;
