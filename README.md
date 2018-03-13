# git-webhook-ci [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A Git (github/gitee) webhook callback server to fetch new code (poor man CI)

This little tool is born out of real projects. Keep having to deploy and setup demo site etc. Why bother if you own the git account?
You just need a new cert from github, add this to your project, and setup accordingly, and Viola, you get your own poor man CI :)

## Installation

```sh
  $ npm install --save git-webhook-ci
```

or

```sh
  $ yarn add git-webhook-ci
```

## Configuration && Usage

Create a js file (normally on your project root directory). Let's call it `webhook.js`.

```js
const gitWebhook = require('git-webhook-ci');
const config = {
  "secret": "your-github-webhook-secret",
  "path": "/webhook",
  "port": 8081,
  "branch": "refs/heads/master",
  "cmd": "git pull origin master --no-edit"
};
/*
The only require field is `secret` everything else are optional
*/
gitWebhook(config);
```

## New in 0.4.0 - cmd accept (String) command to run or (Function) callback

The `cmd` config option now accept a function.

The signature as follow

```js
{
  secret: 'your-secret-between-you-and-github',
  cmd: (result, opt) => {
    // result has 3 properties
    // 1. payload
    // 2. host
    // 3. event - from github / gitee
    // opt is an environment variable that you can pass to the spawn
  }
}
```

## New in 0.4.0 - support Gitee.com

You can now pass a new configuration option `provider`:
```js
{
  secret: 'your-password-between-you-and-gitee',
  provider: 'gitee'
}
```
## Others

If your server is running Linux and support `systemd`;
then you can use [generator-nodex](https://github.com/NewbranLTD/generator-nodex) to generate a start up file

---

Then go to your github settings --> webhooks. Supply the configuration parameters:

**Payload URL**: The url where your server is running (let's use example.com) http://example.com:8081/webhook
As you can see the port number `8081` and `/webhook` correspond the config file, so change it accordingly.

**Content type**: select `application/json`

_**Secret**_: generate your own secret phrase, again correspond the configuration file.

**Which events would you like to trigger this webhook?** Just the push event

**Active**: check this check box so you can see the log from github.

The `cmd` field is your config is the actual method to run. See table below for more details:

### Full configuration properties

| Property name | Description   | Default  | Type |
| ------------- | ------------- | ---------| -----|
| dir           | Where the git root directory is, default to where it gets call | `process.cwd()` | String |
| secret        | A secret key pass to encrypt data between github and your server | '' | String |
| path          | The path where the web hook call to your server | `/webhook` | String |
| port          | The port number where this callback server running on | 8081 | Integer |
| branch        | The branch where you will trigger action when received event from github | `refs/heads/master` | String |
| cmd           | The command to execute when callback happens  | `git pull origin master --no-edit` | String |


### Debug option

If you want to know what is happening internally, you can pass `NODE_ENV=debug`. It will `console.log` out information.

```sh
  NODE_ENV=debug node ./webhook.js
```

## CLI

Coming soon.

### TODO(s)

1. Test with gitlab, ~~gitee~~ etc.
2. Expand the branch option to accept multiple branches
3. Expand the cmd option to accept ~~`Function`~~ and `Object` that allows multiple reaction based on the push event

## License

MIT © [NEWBRAN.CH](joelchu.com)


[npm-image]: https://badge.fury.io/js/git-webhook-ci.svg
[npm-url]: https://npmjs.org/package/git-webhook-ci
[travis-image]: https://travis-ci.org/NewbranLTD/git-webhook-ci.svg?branch=master
[travis-url]: https://travis-ci.org/NewbranLTD/git-webhook-ci
[daviddm-image]: https://david-dm.org/NewbranLTD/git-webhook-ci.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/NewbranLTD/git-webhook-ci

Power by [generator-nodex](https://github.com/NewbranLTD/generator-nodex).
