/**
 * Breakout the log function to make it cleaner
 */
const log = (...args) => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'debug') {
    console.log(args);
  }
};
module.exports = log;
