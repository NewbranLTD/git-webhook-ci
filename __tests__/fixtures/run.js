'use strict';
const gitWebhookCi = require('../../lib/index');

const config = {};

async function methodToTest(config) {
  return gitWebhookCi(config);
}

try {
  methodToTest(config);
} catch (e) {
  console.log('Error catch by ourself', e);
}
