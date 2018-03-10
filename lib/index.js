'use strict';
/**
 * webhook for github to build a cheap and cheerful CI
 * 1. Only do something when the master branch is updated
 * 2. Only affect ./ folder to do a git pull master
 * 3. Restart the script accordingly
 */
const { spawn } = require('child_process');
const http = require('http');
const createHandler = require('github-webhook-handler');
// log method
const log = (...args) => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'debug') {
    console.log(args);
  }
};
// Main
/**
 * @param {object} config configuration for the function return
 * @return {function} for calls
 */
const serve = config => {
  /**
   * @param {string} p path to the git directory
   * @param {object} flags parameters
   */
  return (p, flags) => {
    return new Promise( resolver => {
      const env = Object.assign({}, process.env);
      const handler = createHandler({
        path: config.path,
        secret: config.secret
      });
      const cwd = p ? p : process.cwd();
      const options = { env, cwd };
      log('webhook cwd', cwd);

      http.createServer(function(req, res) {
        handler(req, res, function(err) {
          res.statusCode = 404;
          log('The url got called! [%s]', req.url);
          res.end('-- no such location --');
        });
      }).listen(config.port, () => {
        log(`webhook server start @ ${config.port}`);
      });

      handler.on('error', function(err) {
        log('Error:', err.message);
      });

      handler.on('push', function(event) {
        log('Received a push event for %s to %s',
          event.payload.repository.name,
          event.payload.ref);
        if (event.payload.ref === config.branch) {
          const process = spawn('npm', ['run', 'pull'], options);
          // return the process so the outside can quit this app
          resolver(process);
          process.stdout.on('data', data => {
            log(`pull stdout: ${data}`);
          });
        }
      });
    });
  };
};
