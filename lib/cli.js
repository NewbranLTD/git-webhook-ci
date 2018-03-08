'use strict';
/**
 * run from cli
 */
const serve = require('./index');
const meow = require('meow');
const cli = meow(
  `
    Usage
      $ node startup.js <path>
  `,
  { flags: {ci: 'ci'} }
);

// run it
serve(cli.input[0], cli.flags);
