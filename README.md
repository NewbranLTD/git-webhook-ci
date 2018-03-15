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
  "branch": "refs/heads/master", // New in 0.4.1 you can pass * wildcard to listen to all branches
  "cmd": "git pull origin master --no-edit"
};
/*

*/
gitWebhook(config);
```

*The only require field is `secret` everything else are optional*

The minimum setup can be like this

```js

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

## New in 0.4.x - support Gitee.com

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

### Full configuration properties

| Property name | Description   | Default  | Type |
| ------------- | ------------- | ---------| -----|
| dir           | Where the git root directory is, default to where it gets call | `process.cwd()` | String |
| secret        | A secret key pass to encrypt data between github and your server | '' | String |
| path          | The path where the web hook call to your server | `/webhook` | String |
| port          | The port number where this callback server running on | 8081 | Integer |
| branch        | The branch where you will trigger action when received event from github. You can pass `*` wildcard to listen to all the branches  | `refs/heads/master` | String |
| cmd           | The command to execute when callback happens. You can also pass this as a function (see above for signature) and especially useful when you use `*` for branch  | `git pull origin master --no-edit` | String |

### Debug option

~~If you want to know what is happening internally, you can pass `NODE_ENV=debug`. It will `console.log` out information.~~

Going to replace our own log with `debug` in the next release (0.6.0 coming soon)

```sh
  DEBUG=* node ./webhook.js
```

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

## Setup with github, gitee, gitlab etc

Then go to your github settings --> webhooks. Supply the configuration parameters:

**Payload URL**: The url where your server is running (let's use example.com) http://example.com:8081/webhook
As you can see the port number `8081` and `/webhook` correspond the config file, so change it accordingly.

**Content type**: select `application/json`

_**Secret**_: generate your own secret phrase, again correspond the configuration file.

**Which events would you like to trigger this webhook?** Just the push event

**Active**: check this check box so you can see the log from github.

The `cmd` field is your config is the actual method to run. See table below for more details:

## Working with systemd

If your server is running Linux and support `systemd`;
then you can use [generator-nodex](https://github.com/NewbranLTD/generator-nodex) to generate a start up file

## Work with Nginx

You might not want to expose the `http://yourdomain.com:8081/webhook` like this so you could set this up with nginx easily

```
server {

  server_name yourdomain.com;

  location = /webhook {
    proxy_pass http://localhost:8081;
    proxy_set_header Host $host;
    # getting the visitor info
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
    # for socket connection
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_http_version 1.1;
  }

  location / {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
    # getting the visitor info
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
    # for socket connection
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_http_version 1.1;
  }
}

```

### TODO(s)

1. Test with ~~gitlab~~, ~~gitee~~ etc. (0.4.0 add gitee support, 0.5.0 add gitlab support) **need more test for the two new providers**.
2. ~~Expand the branch option to accept multiple branches~~ **(0.4.1 add `*` as wildcard to listen to all branches and combine with `cmd` as function to let the user to choose what to do)**
3. ~~Expand the cmd option to accept `Function` and `Object` that allows multiple reaction based on the push event~~ **done**

## License

MIT © [NEWBRAN.CH](joelchu.com)


[npm-image]: https://badge.fury.io/js/git-webhook-ci.svg
[npm-url]: https://npmjs.org/package/git-webhook-ci
[travis-image]: https://travis-ci.org/NewbranLTD/git-webhook-ci.svg?branch=master
[travis-url]: https://travis-ci.org/NewbranLTD/git-webhook-ci
[daviddm-image]: https://david-dm.org/NewbranLTD/git-webhook-ci.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/NewbranLTD/git-webhook-ci

Power by [generator-nodex](https://github.com/NewbranLTD/generator-nodex).
