/**
 * Construct the interface for Wechat
 */
const WechatHandler = require('./wechat-class');
const server = require('../lib/server');
const debug = require('debug')('git-webhook-ci:wechat');

module.exports = function(config, opt, callback) {
  const wechat = new WechatHandler(config);

  /* This is not implemented, there is no need at the moment
  wechat.on('error', err => {
    debug('error', err);
  });
  */
  wechat.on('push', result => {
    callback(result, opt);
  });

  return server(
    config,
    (req, res) => {
      wechat.handler(req, res, function(err) {
        res.statusCode = 404;
        debug('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    },
    debug
  );
};
