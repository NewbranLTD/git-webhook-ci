/**
 * Return the provider based on the config
 */
const githubWebhookHandler = require('github-webhook-handler');
const gitee = require('./gitee');
const gitlab = require('./gitlab');
/**
 * Wrap all the configuration check code here
 * Then init the instance and return it
 */
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
