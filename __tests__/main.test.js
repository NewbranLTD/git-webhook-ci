'use strict';
const gitWebhook = require('../lib/index.js');
// Create a new wrapper method to
async function methodToTest(config) {
  let result = await gitWebhook(config);
  return result;
}

describe('gitWebhookCi test', () => {
  test('Expect to pass with correct options', () => {
    expect(() => {
      methodToTest();
    }).toThrow();
  });
});
