'use strict';
/**
 * Wechat mini app callback
 */
const nothing = () => {};
const supertest = require('supertest');
const sha1 = require('sha1');
const gitWebhookCi = require('../index');
const globalConfig = require('./fixtures/config.json');
const debug = require('debug')('git-webhook-ci:test');
const { getTimestamp, getRandomInt } = require('../lib/providers/lib/helpers');
const nonce = getRandomInt(1, 10);
const timestamp = getTimestamp();
const echostr = 'knock knock';
const config = Object.assign(
  {},
  globalConfig,
  {
    secret: 'the-token-setup-with-wechat',
    provider: 'wechat',
    inited: false,
    port: 8082
  },
  {
    cmd: (payload, opt) => {
      debug('Execute gitee callback');
      nothing(opt);
    }
  }
);
const host = [config.host, config.port].join(':');
// Run test
describe('Test Wechat mini callback interface', () => {
  const tmpArr = [config.secret, timestamp, nonce];
  tmpArr.sort();
  const signature = sha1(tmpArr.join(''));
  let server;
  let ctn = 0;
  let option = {};
  // There will be two test here, first test the verify method
  beforeEach(() => {
    if (ctn > 0) {
      option = Object.assign({}, config, {
        inited: true
      });
    } else {
      option = Object.assign({}, config);
    }
    server = gitWebhookCi(option);
    ++ctn;
    debug(`Tick ${ctn}`);
  });
  // Kill the server
  afterEach(() => {
    server.close();
  });

  test('It should able to verify the wechat GET with query strings', done => {
    supertest(host)
      .get(config.path)
      .query({ signature, timestamp, nonce, echostr })
      .set('Accept', 'application/json')
      .expect(200, `${echostr}`)
      .end(err => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  test('It should now accept incoming post query', done => {
    supertest(host)
      .post(config.path)
      .send({ key: 'value' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, /ok/)
      .end(err => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
