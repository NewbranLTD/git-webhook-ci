/**
 * Breakout the option here to make it cleaner
 */
module.exports = {
  provider: 'github', // For future use
  dir: '',
  path: '/webhook',
  port: 8081,
  branch: 'refs/heads/master',
  cmd: 'git pull origin master --no-edit'
};
