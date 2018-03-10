# gulp-git-webhook [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A Git(hub) webhook callback server to fetch new code (poor man CI)

This little tool is born out of real projects. Keep having to deploy and setup demo site etc. Why bother if you own the git account?
You just need a new cert from github, add this to your project, and setup accordingly, and Viola, you get your own poor man CI :)

## Installation

```sh
  $ npm install --save gulp-git-webhook
```

or

```sh
  $ yarn add gulp-git-webhook
```

## Configuration && Usage

Create a js file (normally on your project root directory). Let's call it `webhook.js`.

```js
const gitWebhook = require('gulp-git-webhook');
const config = {
  "secret": "your-github-webhook-secret",
  "path": "/webhook",
  "port": 8081,
  "branch": "refs/heads/master",
  "cmd": "git pull origin master --no-edit"
};
gitWebhook(config);
```

If your server is running Linux and support `systemd`;
then you can use [generator-nodex](https://github.com/NewbranLTD/generator-nodex) to generate a start up file

Then go to your github settings --> webhooks. Supply the configuration parameters:

Payload URL: The url where your server is running (let's use example.com) http://example.com:8081/webhook
As you can see the port number `8081` and `/webhook` correspond the config file, so change it accordingly.

Content type: select `application/json`

Secret: generate your own secret phrase, again correspond the configuration file.

Which events would you like to trigger this webhook? Just the push event

Active: check this check box so you can see the log from github.

### One more thing

The `cmd` field is your config is the actual method to run.

## License

MIT © [NEWBRAN.CH](joelchu.com)


[npm-image]: https://badge.fury.io/js/gulp-git-webhook.svg
[npm-url]: https://npmjs.org/package/gulp-git-webhook
[travis-image]: https://travis-ci.org/NewbranLtd/gulp-git-webhook.svg?branch=master
[travis-url]: https://travis-ci.org/NewbranLtd/gulp-git-webhook
[daviddm-image]: https://david-dm.org/NewbranLtd/gulp-git-webhook.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/NewbranLtd/gulp-git-webhook

Power by [generator-nodex](https://github.com/NewbranLTD/generator-nodex).
