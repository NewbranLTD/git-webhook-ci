'use strict';
jest.setTimout = 10000;
/**
 * CLI test
 */
const { spawn } = require('child_process');
const nothing = () => {};
const supertest = require('supertest');
const payload = require('./fixtures/gitee-payload.json');
const globalConfig = require('./fixtures/config.json');
const gitWebhookCi = require('../index');
const debug = require('debug')('git-webhook-ci:test');
const { join } = require('path');
const cli = join(__dirname, '..', 'cli.js');
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
describe('Testing with gitee provider using the cli', () => {
  let server;
  beforeAll(done => {
    server = spawn('node', [cli]);
    server.stdout.on('data', data => {
      debug(`stdout ${data}`);
    });
    done();
  });

  afterAll(() => {
    server.kill();
  });

  it('It should respond with a push payload', done => {
    supertest(host)
      .post(config.path)
      .set('Accept', 'application/json')
      .send(payload.push)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        if (err) {
          debug('err', err);
        }
        done();
      });
  });
});
