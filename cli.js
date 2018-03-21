'use strict';
/**
 * Run from cli
 * dir: '',
 * path: '/webhook',
 * port: 8081,
 * branch: 'refs/heads/master',
 * cmd: 'git pull origin master --no-edit'
 */
const gitWebhook = require('./index');
const meow = require('meow');
const cli = meow(
  `
    Usage
      $ node git-webhook-ci <path>

      $ node git-webhook-ci <path> --secret secret-from-github

      $ node git-webhook-ci <path> --secret secret-from-github --cmd 'git pull origin develop'

    For wechat

      $ node git-webhook-ci <path> -secret wechat-token --inited true --cmd 'some cmd'
  `,
  {
    flags: {
      provider: {
        type: 'string',
        alias: 'pr',
        default: 'github'
      },
      dir: {
        type: 'string',
        alias: 'd'
      },
      path: {
        type: 'string',
        alias: 'p',
        default: '/webhook'
      },
      port: {
        type: 'integer',
        alias: 'po',
        default: 8081
      },
      branch: {
        type: 'string',
        alias: 'b',
        default: 'refs/heads/master'
      },
      secret: {
        type: 'string',
        alias: 's',
        default: ''
      },
      cmd: {
        type: 'string',
        alias: 'c',
        default: 'git pull origin master --no-edit'
      },
      inited: {
        type: 'boolean',
        alias: 'i',
        default: false
      }
    }
  }
);
// Wrap into a method to call
const serve = function(p, flags) {
  if (!p || p === '') {
    throw new Error('You must provide the <path>! Check usage for more detail.');
  }
  const config = Object.assign({ __caller__: 'meow' }, { dir: p }, flags);
  return gitWebhook(config);
};
// Run it
serve(cli.input[0], cli.flags);
