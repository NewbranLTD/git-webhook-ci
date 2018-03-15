'use strict';
/**
 * This will setup the Server and handler middleware
 */
const GitWebhookCi = require('../../lib/providers/gitee');
const debug = require('debug')('git-webhook-ci:demo');
const http = require('http');
// Main
const serve = config => {
  const g = new GitWebhookCi(config);
  // Register all the event listeners here first
  g.on('error', err => {
    debug('error', err);
  });

  g.on('push', result => {
    debug('result', result);
  });

  return http
    .createServer(function(req, res) {
      g.handler(req, res, function(err) {
        res.statusCode = 404;
        debug('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    })
    .listen(config.port, () => {
      debug(`webhook server start @ ${config.port}`);
    });
};
// Export
module.exports = serve;
