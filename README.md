# git-webhook-ci [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> A Git(hub) webhook callback server to fetch new code (poor man CI)

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
gitWebhook(config);
```

If your server is running Linux and support `systemd`;
then you can use [generator-nodex](https://github.com/NewbranLTD/generator-nodex) to generate a start up file

---

Then go to your github settings --> webhooks. Supply the configuration parameters:

**Payload URL**: The url where your server is running (let's use example.com) http://example.com:8081/webhook
As you can see the port number `8081` and `/webhook` correspond the config file, so change it accordingly.

**Content type**: select `application/json`

_**Secret**_: generate your own secret phrase, again correspond the configuration file.

Which events would you like to trigger this webhook? Just the push event

**Active**: check this check box so you can see the log from github.

The `cmd` field is your config is the actual method to run. See table below for more details:

### Full configuration properties

| Property name | Description   | Default  | Type |
| ------------- | ------------- | ---------| -----|
| secret        | A secret key pass to encrypt data between github and your server | '' | String |
| path          | The path where the web hook call to your server | `/webhook` | String |
| port          | The port number where this callback server running on | 8081 | Integer |
| branch        | The branch where you will trigger action when received event from github | `refs/heads/master` | String |
| cmd           | The command to execute when callback happens  | `git pull origin master --no-edit` | String |


### Debug option

If you want to know what is happening internally, you can pass `NODE_ENV=debug`. It will console lot out information.

```sh
  NODE_ENV=debug node ./webhook.js
```

## License

MIT © [NEWBRAN.CH](joelchu.com)


[npm-image]: https://badge.fury.io/js/git-webhook-ci.svg
[npm-url]: https://npmjs.org/package/git-webhook-ci
[travis-image]: https://travis-ci.org/NewbranLTD/git-webhook-ci.svg?branch=master
[travis-url]: https://travis-ci.org/NewbranLTD/git-webhook-ci
[daviddm-image]: https://david-dm.org/NewbranLTD/git-webhook-ci.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/NewbranLTD/git-webhook-ci

Power by [generator-nodex](https://github.com/NewbranLTD/generator-nodex).
