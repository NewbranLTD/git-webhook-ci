const assert = require('assert');
const gitWebhook = require('../lib/index.js');
// Create a new wrapper method to
async function methodToTest(config) {
  let result = await gitWebhook(config);
  return result;
}

describe('gulpGitWebhook', () => {
  it('Call function without passing option', () => {
    assert.throws(methodToTest, Error, 'Expect to pass options!');
  });
});
