'use strict';
const gitWebhookCi = require('../../lib/index');

const config = {
  secret: 'some-crappy-method'
};

gitWebhookCi(config);
