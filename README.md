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

## Usage

```js
const gulpGitWebhook = require('gulp-git-webhook');

gulpGitWebhook('Magic');
```
## License

MIT © [NEWBRAN.CH](joelchu.com)


[npm-image]: https://badge.fury.io/js/gulp-git-webhook.svg
[npm-url]: https://npmjs.org/package/gulp-git-webhook
[travis-image]: https://travis-ci.org/NewbranLtd/gulp-git-webhook.svg?branch=master
[travis-url]: https://travis-ci.org/NewbranLtd/gulp-git-webhook
[daviddm-image]: https://david-dm.org/NewbranLtd/gulp-git-webhook.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/NewbranLtd/gulp-git-webhook

Power by [](https://github.com/NewbranLTD/undefined).
