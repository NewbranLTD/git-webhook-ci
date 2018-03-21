'use strict';
/**
 * Wechat mini app callback
 */
const nothing = () => {};
const supertest = require('supertest');
const payload = require('./fixtures/gitlab-payload.json');
const globalConfig = require('./fixtures/config.json');
const gitWebhookCi = require('../index');
const debug = require('debug')('git-webhook-ci:test');

describe('Test Wechat mini callback interface', () => {
  
});
