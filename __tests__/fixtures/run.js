'use strict';
const gitWebhookCi = require('../../lib/index');
const debug = require('debug')('run');
const config = {};

async function methodToTest(config) {
  return gitWebhookCi(config);
}

try {
  methodToTest(config);
} catch (e) {
  debug('Error catch by ourself', e);
}
