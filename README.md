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
const gulpGitWebhook = require('gulp-git-webhook');
const config = {
  "secret": "your-github-webhook-secret",
  "path": "/webhook",
  "port": 8081,
  "branch": "refs/heads/master"
};
gulpGitWebhook(config);
```

Then you can add a line to your `package.json`



## License

MIT © [NEWBRAN.CH](joelchu.com)


[npm-image]: https://badge.fury.io/js/gulp-git-webhook.svg
[npm-url]: https://npmjs.org/package/gulp-git-webhook
[travis-image]: https://travis-ci.org/NewbranLtd/gulp-git-webhook.svg?branch=master
[travis-url]: https://travis-ci.org/NewbranLtd/gulp-git-webhook
[daviddm-image]: https://david-dm.org/NewbranLtd/gulp-git-webhook.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/NewbranLtd/gulp-git-webhook

Power by [generator-nodex](https://github.com/NewbranLTD/generator-nodex).
