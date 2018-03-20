/**
 * Rewrite the module with ES6, then ditch github-webhook-handler deps
 */
'use strict';
/**
 * Webhook for github to build a cheap and cheerful CI
 * 1. Only do something when the master branch is updated
 * 2. Only affect ./ folder to do a git pull master
 * 3. Restart the script accordingly
 * The github-webook-handler won't work with other git provider
 * @TODO if I want to work with gitee / gitlab then I need to write one myself
 */
const server = require('../lib/server');
const githubWebhook = require('github-webhook-handler');
const debug = require('debug')('git-webhook-ci:gitlab');
/**
 * @param {object} config configuration for the function return
 * @return {function} for calls
 */
const handler = (config, opt, callback) => {
  const _handler = githubWebhook({
    path: config.path,
    secret: config.secret
  });
  // Start up server
  const serverInt = server(
    config,
    (req, res) => {
      _handler(req, res, function(err) {
        res.statusCode = 404;
        debug('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    },
    debug
  );

  // On error
  _handler.on('error', err => {
    debug('Error:', err.message);
  });
  // On received push event
  _handler.on('push', result => {
    const ref = result.payload.ref;
    if (config.branch === '*' || config.branch === ref) {
      callback(result, opt, ref);
    } else {
      debug('Received a push event for %s to %s', result.payload.repository.name, ref);
    }
  });
  // Return the server instance for stop or restart
  return serverInt;
};
// Export
module.exports = handler;
