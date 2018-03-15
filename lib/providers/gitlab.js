/**
 * Implement the gitlab methods
 */
const http = require('http');
const GitlabWebhook = require('./gitlab-class');
const debug = require('debug')('gitlab');

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

  return http
    .createServer(function(req, res) {
      gitlab.handler(req, res, function(err) {
        res.statusCode = 404;
        debug('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    })
    .listen(config.port, () => {
      debug(`Gitlab webhook server start @ ${config.port}`);
    });
};
