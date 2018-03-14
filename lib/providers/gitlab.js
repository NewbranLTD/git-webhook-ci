/**
 * Implement the gitlab methods
 */
const http = require('http');
const GitlabWebhook = require('./gitlab-class');
const log = require('../log');

module.exports = function(config, opt, callback) {
  const gitlab = new GitlabWebhook(config);

  // Listen on error
  gitlab.on('error', err => {
    log('error', err);
  });

  // Listen on the push event - success
  gitlab.on('push', result => {
    const ref = result.payload.ref;
    if (config.branch === '*' || ref === config.branch) {
      callback(result, opt, ref);
    } else {
      log('Gitee webhook is not expecting this branch', ref);
    }
  });

  return http
    .createServer(function(req, res) {
      gitlab.handler(req, res, function(err) {
        res.statusCode = 404;
        log('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    })
    .listen(config.port, () => {
      log(`Gitlab webhook server start @ ${config.port}`);
    });
};
