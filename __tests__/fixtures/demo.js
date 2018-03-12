'use strict';
/**
 * This will setup the Server and handler middleware
 */
const gitWebhookCi = require('../../lib/providers/gitee');
const log = require('../../lib/log');
const http = require('http');

const serve = () => {

  const handler = new gitWebhookCi();
  
  const server = http
    .createServer(function(req, res) {
      handler(req, res, function(err) {
        res.statusCode = 404;
        log('The url got called! [%s]', req.url);
        res.end('-- no such location --');
      });
    })
    .listen(config.port, () => {
      log(`webhook server start @ ${config.port}`);
    });


  return server;
};

module.exports = serve;
