/* eslint-disable: no-unused-vars: 0 */
'use strict';
const nothing = () => {};
const gitWebhook = require('../index.js');
const supertest = require('supertest');
const debug = require('debug')('test');
const config = {
  secret: 'some-silly-secret-you-dont-want-to-know',
  cmd: (payload, opt) => {
    debug('cmd callback executed');
    nothing(opt);
  }
};

// Run test main
describe('gitWebhookCi test', () => {
  let server;
  beforeEach(done => {
    server = gitWebhook(config);
    done();
  });

  afterEach(() => {
    server.close();
  });

  test('Expect the server start with correct configuration', () => {
    return supertest('http://localhost:8081')
      .get('/')
      .expect(404);
  });
});
