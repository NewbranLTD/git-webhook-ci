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

## Configuration and usage

Create a js file (normally on your project root directory). Let's call it `webhook.js`.

```js
const gitWebhook = require('git-webhook-ci');
const config = {
  "secret": "your-github-webhook-secret",
  "path": "/webhook",
  "port": 8081,
  "branch": "refs/heads/master", // New in 0.4.1 you can pass * wildcard to listen to all branches
  "cmd": "git pull origin master --no-edit"
};
/*

*/
gitWebhook(config);
```

The minimum setup can be like this:

```js

  // Default is github
  gitWebhook({secret: "your-github-webhook-secret"});

  // For Gitee
  gitWebhook({secret: 'your-gitee-password', provider: 'gitee'});

  // For Gitlab
  gitWebhook({secret: 'your-gitlab-token', provider: 'gitlab'});

```


## New in 0.4.0 - cmd accept (String) command to run or (Function) callback

The `cmd` config option now accept a function.

The signature as follow

```js
{
  secret: 'your-secret-between-you-and-github',
  cmd: (result, opt, ref) => {
    // result has 3 properties
    // 1. payload
    // 2. host
    // 3. event - from github / gitee
    // opt is an environment variable that you can pass to the spawn
  }
}
```

Example how to combine the wildcard branch option, and a function callback

```js
const gitWebhook = require('git-webook-ci');
const { spawn } = require('child_process');

const server = gitWebhook({
  secret: 'your-secret-between-you-and-github',
  branch: '*',
  cmd: (result, opt, ref) => {
    switch (ref) {
      case 'refs/heads/master':
        const e1 = spawn('npm', ['run', 'something'], opt);
      break;
      case 'refs/heads/develop':
        const e2 = spawn('npm', ['run', 'something-else'], opt);
      break;
      default:
        // do special stuff using the result object
        specialFunc(result.payload, opt);
    }
  }
});

```

As you can see from the code example from above. The method `gitWebhook` actually return the
`server` instance from `http.createServer`. So you can make it to stop, restart etc easily.

## New in 0.4.x - support 码云 Gitee.com

You can now pass a new configuration option `provider`:
```js
{
  secret: 'your-password-between-you-and-gitee',
  provider: 'gitee'
}
```

## New in 0.5.x - support Gitlab.com

You just need to change the provider to `gitlab`:

```js
{
  secret: 'your-gitlab-token',
  provider: 'gitlab'
}
```

## New in 0.8.x - support 微信小程序消息服务 Wechat mini app callback

We have added a new provider here - it's not a git repo. It supports the [Wechat callback](https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/callback_help.html).

**There are several different between wechat callback and the other providers**

There is a new property that you need to supply when you init your webhook with Wechat.
Because this is a two step process. Once your server is verify with Wechat server.
They will just push data over to the url. So you need to run this once like so.

First you need to run with the `inited:false` (default)

```js
{
  secret: 'the-token-you-setup-with-wechat',
  provider: 'wechat',
  inited: false // this is default
}
```

Then re-config your webhook to run normal operation:

```js
{
  secret: 'the-token-you-setup-with-wechat',
  provider: 'wechat',
  inited: true // default: false
}
```

There is a complete example in the [wiki](https://github.com/NewbranLTD/git-webhook-ci/wiki/Working-with-Wechat-callback) to demonstrate how you can do this automatically,
with additional module `fs-extra`, `nodemon` and `node-config`.

---

If you are using function as your `cmd` property, there will only be two parameters supply, when execute your callback.

```js
  {
    cmd: (result, opt) => {
      // there is no ref
    }
  }
```

### Full configuration properties

| Property name | Description   | Default  | Type |
| ------------- | ------------- | ---------| -----|
| dir           | Where the git root directory is, default to where it gets call | `process.cwd()` | String |
| secret        | A secret key pass to encrypt data between github and your server | '' | String |
| path          | The path where the web hook call to your server | `/webhook` | String |
| port          | The port number where this callback server running on | `8081` | Integer |
| branch        | The branch where you will trigger action when received event from github. You can pass `*` wildcard to listen to all the branches  | `refs/heads/master` | String |
| cmd           | The command to execute when callback happens. You can also pass this as a function (see above for signature) and especially useful when you use `*` for branch  | `git pull origin master --no-edit` | String |
| inited        | only available with `wechat` provider | `false` | Boolean |

### Debug option

Internally we use `debug` to track what's going on. So you can just pass the env during the start up of the script to debug your setup.

```sh
  DEBUG=* node ./webhook.js
```

If you do that, you will see a huge amount of info. All our debug flags are prefixed with `git-webhook-ci`,
and here is the list of all the keys we use in this npm.

- git-webhook-ci:main
- git-webhook-ci:gitlab
- git-webhook-ci:github
- git-webhook-ci:gitee
- git-webhook-ci:wechat
- git-webhook-ci:demo (only in test)
- git-webhook-ci:test

For example:

```sh
  DEBUG=git-webhook-ci:main,git-webhook-ci:wechat node ./webhook.js
```

Then you will only see the main (top interface) and the Wechat internal debug messages.

## CLI

You can install this tools globally.

```sh
  $ npm install git-webhook-ci --global
```

Then you can call it from command line like so

```sh
  $ git-webhook-ci /path/to/your/git --secret secret-you-setup

```

Or in your `package.json`

```js
  {
    "scripts": {
      "webhook": "git-webhook-ci ./ --secret secret-you-setup"
    }
  }
```

Then just run it with `npm run webhook`

## HOW TO

Check our [Wiki](https://github.com/NewbranLTD/git-webhook-ci/wiki) for more information about how to setup your app.  

## License

MIT © [NEWBRAN.CH](joelchu.com)


[npm-image]: https://badge.fury.io/js/git-webhook-ci.svg
[npm-url]: https://npmjs.org/package/git-webhook-ci
[travis-image]: https://travis-ci.org/NewbranLTD/git-webhook-ci.svg?branch=master
[travis-url]: https://travis-ci.org/NewbranLTD/git-webhook-ci
[daviddm-image]: https://david-dm.org/NewbranLTD/git-webhook-ci.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/NewbranLTD/git-webhook-ci

Power by [generator-nodex](https://github.com/NewbranLTD/generator-nodex).
