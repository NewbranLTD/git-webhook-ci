/**
 * Return the provider based on the config
 */
const githubWebhookHandler = require('github-webhook-handler');

module.exports = provider => {
  switch (provider) {
    case 'gitee':

    break;
    case 'gitlab':

    break;
    default:
      return githubWebhookHandler;
  }
}
