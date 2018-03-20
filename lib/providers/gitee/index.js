/**
 * Implement the Gitee class
 */

const GiteeWebhook = require('./gitee-class');
const debug = require('debug')('git-webhook-ci:gitee');
const server = require('../lib/server');

// Main
module.exports = function(config, opt, callback) {
  const gitee = new GiteeWebhook(config);
  // Register all the event listeners here first
  gitee.on('error', err => {
    debug('error', err);
  });
  // Finally the push is accepted
  gitee.on('push', result => {
    const ref = result.payload.ref;
    if (config.branch === '*' || config.branch === ref) {
      callback(result, opt, ref);
    } else {
      debug('Gitee webhook is not expecting this branch', ref);
    }
  });
  // Return the server instance
  return server(
    config,
    (req, res) => {
      gitee.handler(req, res, function(err) {
        res.statusCode = 404;
        debug('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    },
    debug
  );
};
