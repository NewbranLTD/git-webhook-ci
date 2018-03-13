'use strict';
/**
 * This is now only responsible for checking the options
 * and call the correct provider
 */
const provider = require('./lib/providers');
const defaultOptions = require('./lib/option');
const log = require('./lib/log');
const { spawn } = require('child_process');

// Create a callback to execute
const createCallback = function(cmd) {
  return function(payload, opt) {
    const process = spawn(cmd[0], cmd.filter((c, i) => i > 0), opt);
    process.stdout.on('data', data => {
      log(`cmd stdout: ${data}`);
    });
    process.stderr.on('data', data => {
      log(`cmd stderr: ${data}`);
    });
    process.on('close', code => {
      log(`cmd exited with ${code}`);
    });
  };
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
  if (typeof config.cmd !== 'string' && typeof config.cmd !== 'function') {
    throw new Error('Cmd must be a string or a function!');
  }
  log(config);
  const createHandler = provider(config.provider);
  // Return without Promise, because there is no need to
  return createHandler(
    config,
    {
      env: Object.assign({}, process.env),
      cwd: config.dir ? config.dir : process.cwd()
    },
    typeof config.cmd === 'function' ? config.cmd : createCallback(config.cmd.split(' '))
  );
};
// Export
module.exports = serve;
