/**
 * Return the provider based on the config
 */
const githubWebhookHandler = require('github-webhook-handler');
const gitee = require('./gitee');
const gitlab = require('./gitlab');
// Main
module.exports = provider => {
  switch (provider) {
    case 'gitee':
      return gitee;
    case 'gitlab':
      return gitlab;
    default:
      return githubWebhookHandler;
  }
};
