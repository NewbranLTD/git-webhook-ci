'use strict';
/**
 * This will setup the Server and handler middleware
 */
const GitWebhookCi = require('../../lib/providers/gitee');
const log = require('../../lib/log');
const http = require('http');
// Main
const serve = config => {
  const g = new GitWebhookCi(config);
  // Register all the event listeners here first
  g.on('error', err => {
    console.log('error', err);
  });

  g.on('push', result => {
    console.log('result', result);
  });

  return http
    .createServer(function(req, res) {
      g.handler(req, res, function(err) {
        res.statusCode = 404;
        log('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    })
    .listen(config.port, () => {
      log(`webhook server start @ ${config.port}`);
    });
};
// Export
module.exports = serve;
