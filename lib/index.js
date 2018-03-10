'use strict';
/**
 * Webhook for github to build a cheap and cheerful CI
 * 1. Only do something when the master branch is updated
 * 2. Only affect ./ folder to do a git pull master
 * 3. Restart the script accordingly
 */
const { spawn } = require('child_process');
const http = require('http');
const createHandler = require('github-webhook-handler');
// Log method
const log = (...args) => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'debug') {
    console.log(args);
  }
};
// Default options
const defaultOptions = {
  dir: '',
  path: '/webhook',
  port: 8081,
  branch: 'refs/heads/master',
  cmd: 'git pull origin master --no-edit'
};

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
    handler.on('push', function(event) {
      log(
        'Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref
      );
      if (event.payload.ref === config.branch) {
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
