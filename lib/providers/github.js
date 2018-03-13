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
const { spawn } = require('child_process');
const http = require('http');
const githubWebhook = require('github-webhook-handler');
const log = require('./lib/log');
/**
 * @param {object} config configuration for the function return
 * @return {function} for calls
 */
const handler = (config, opt) => {
  const _handler = githubWebhook({
    path: config.path,
    secret: config.secret
  });
  // Start up server
  const server = http
    .createServer(function(req, res) {
      _handler(req, res, function(err) {
        res.statusCode = 404;
        log('The url got called! [%s]', req.url, err);
        res.end('-- no such location --');
      });
    })
    .listen(config.port, () => {
      log(`webhook server start @ ${config.port}`);
    });
  // On error
  _handler.on('error', function(err) {
    log('Error:', err.message);
  });
  // On received push event
  _handler.on('push', function(event) {
    log(
      'Received a push event for %s to %s',
      event.payload.repository.name,
      event.payload.ref
    );
    if (event.payload.ref === config.branch) {
      /**
       * @TODO
       * 1) allow cmd to be a function, we will pass the options to this function
       * 2) allow cmd to be an object, the key will be the branch, the value can be string or function
       */
      const process = spawn(config.cmd[0], config.cmd.filter((c, i) => i > 0), opt);

      process.stdout.on('data', data => {
        log(`cmd stdout: ${data}`);
      });
      process.stderr.on('data', data => {
        log(`cmd stderr: ${data}`);
      });
      process.on('close', code => {
        log(`cmd exited with ${code}`);
      });
    }
  });
  // Return the server instance for stop or restart
  return server;
};
// Export
module.exports = handler;
