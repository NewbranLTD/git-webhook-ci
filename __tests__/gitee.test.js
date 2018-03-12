'use strict';
/**
 * Gitee test
 */
const supertest = require('supertest');
const payload = require('./fixtures/gitee-payload.json');
const globalConfig = require('./fixtures/config.json');
const gitWebhookCi = require('../lib/providers/gitee');
const config = Object.assign({
  secret: 'cmd',
  provider: 'gitee'
}, globalConfig);
const host = [config.host, config.port].join(':')
// Run
describe('Testing with gitee provider', () => {
  let server;
  beforeAll(done => {
    gitWebhookCi(config).then(result => {
      server = result;
      done();
    });
  });

  afterAll(() => {
    server.close();
  });

  it('It should respond with a push payload', () => {
    return supertest(host)
      .post(config.path)
      .set('Accept', 'application/json')
      .send(payload.push)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        console.log('err', err);
        console.log('res', res);
      });
  });
});
