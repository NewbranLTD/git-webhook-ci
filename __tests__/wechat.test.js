'use strict';
/**
 * Wechat mini app callback
 */
const nothing = () => {};
const supertest = require('supertest');
const sha1 = require('sha1');
const gitWebhookCi = require('../index');
const debug = require('debug')('git-webhook-ci:test');

const { getTimestamp, getRandomInt } = require('../lib/lib/helpers');

describe('Test Wechat mini callback interface', () => {
  const timestamp = getTimestamp();
  const nonce = getRandomInt(1,10);
  let signature;
  let server;
  let ctn = 0;
  let config = {
    secret: 'the-token-setup-with-wechat',
    provider: 'wechat',
    inited: false
  };
  // There will be two test here, first test the verify method
  beforeEach(() => {
    if (ctn > 0) {
      config.inited = true;
    }
    server = gitWebhookCi(config);
    ++ctn;
    debug(`Tick ${ctn}`);
  });
  // Kill the server
  afterEach(() => {
    server.close();
  });

  test('It should able to verify the wechat GET with query strings', () => {


  });
});
