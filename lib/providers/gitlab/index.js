/**
 * Implement the gitlab methods
 */
const server = require('../lib/server');
const GitlabWebhook = require('./gitlab-class');
const debug = require('debug')('git-webhook-ci:gitlab');

module.exports = function(config, opt, callback) {
  const gitlab = new GitlabWebhook(config);

  // Listen on error
  gitlab.on('error', err => {
    debug('error', err);
  });

  // Listen on the push event - success
  gitlab.on('push', result => {
    const ref = result.payload.ref;
    if (config.branch === '*' || config.branch === ref) {
      callback(result, opt, ref);
    } else {
      debug('Gitee webhook is not expecting this branch', ref);
    }
  });

  return server(
    config,
    (req, res) => {
      gitlab.handler(req, res, function(err) {
        res.statusCode = 404;
        debug('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    },
    debug
  );
};
