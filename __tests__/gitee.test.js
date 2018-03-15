'use strict';
/**
 * Gitee test
 */
const nothing = () => {};
const supertest = require('supertest');
const payload = require('./fixtures/gitee-payload.json');
const globalConfig = require('./fixtures/config.json');
const gitWebhookCi = require('../index');
const debug = require('debug')('git-webhook-ci:test');
const config = Object.assign(
  {
    provider: 'gitee'
  },
  globalConfig,
  {
    cmd: (payload, opt) => {
      debug('Execute gitee callback');
      nothing(opt);
    }
  }
);
const host = [config.host, config.port].join(':');
// Run
describe('Testing with gitee provider', () => {
  let server;
  beforeAll(done => {
    server = gitWebhookCi(config);
    done();
  });

  afterAll(() => {
    server.close();
  });

  it('It should respond with a push payload', done => {
    supertest(host)
      .post(config.path)
      .set('Accept', 'application/json')
      .send(payload.push)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        debug('err', err);
        done();
      });
  });
});
