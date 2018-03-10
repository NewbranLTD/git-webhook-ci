const assert = require('assert');
const gulpGitWebhook = require('../lib/index.js');

async const methodToTest = function(config) {
  return gulpGitWebhook(config);
}


describe('gulpGitWebhook', () => {
  it('has a test', () => {
    assert(false, 'gulpGitWebhook should have a test');
  });
});
