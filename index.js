'use strict';
/**
 * This is now only responsible for checking the options
 * and call the correct provider
 */
const provider = require('./lib/providers');
const defaultOptions = require('./lib/option');
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
  const opt = {
    env: Object.assign({}, process.env),
    cwd: config.dir ? config.dir : process.cwd()
  };
  // Return without Promise, because there is no need to
  return createHandler(config, opt);
};
// Export
module.exports = serve;
