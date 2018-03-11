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
const provider = require('./lib/providers');
const defaultOptions = require('./lib/option');
const log = require('./lib/log');
/**
 * @param {object} config configuration for the function return
 * @return {function} for calls
 */
const serve = options => {
  if (typeof options !== 'object') {
    throw new Error('Expecting options to be an object');
  }
  const config = Object.assign({}, defaultOptions, options);
  if (!config.secret || config.secret === '') {
    throw new Error('You must provide the secret!');
  }
  const createHandler = provider(config.provider);
  /**
   * @TODO allow passing an function to the cmd?
   */
  config.cmd = config.cmd.split(' ');
  /**
   * @param {string} p path to the git directory
   * @param {object} flags parameters
   * @return {object} promise result is server instance
   */
  return new Promise((resolver, rejecter) => {
    // Setup variables
    const env = Object.assign({}, process.env);
    const handler = createHandler({
      path: config.path,
      secret: config.secret
    });
    const cwd = config.dir ? config.dir : process.cwd();
    const options = { env, cwd };
    log('webhook cwd', cwd);
    // Start up server
    const server = http
      .createServer(function(req, res) {
        handler(req, res, function(err) {
          res.statusCode = 404;
          rejecter(err);
          log('The url got called! [%s]', req.url);
          res.end('-- no such location --');
        });
      })
      .listen(config.port, () => {
        log(`webhook server start @ ${config.port}`);
      });
    // On error
    handler.on('error', function(err) {
      log('Error:', err.message);
      rejecter(err);
    });
    // On received push event
    // @TODO need to expand what kind of event its going to accept
    handler.on('push', function(event) {
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
        const process = spawn(config.cmd[0], config.cmd.filter((c, i) => i > 0), options);
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
    // Return the server instance so the outside can quit this app
    resolver(server);
  });
};

module.exports = serve;
