/**
 * Support the gitee style JSON document
 * Gitee post payload
 {
    "before": "fb32ef5812dc132ece716a05c50c7531c6dc1b4d",
    "after": "ac63b9ba95191a1bf79d60bc262851a66c12cda1",
    "ref": "refs/heads/master",
    "user_id": 13,
    "user_name": "123",
    "user": {
      "name": "123",
      "username": "test123",
      "url": "https://gitee.com/oschina"
    },
    "repository": {
        "name": "webhook",
        "url": "http://git.oschina.net/oschina/webhook",
        "description": "",
        "homepage": "https://gitee.com/oschina/webhook"
    },
    "commits": [
        {
            "id": "ac63b9ba95191a1bf79d60bc262851a66c12cda1",
            "message": "1234 bug fix",
            "timestamp": "2016-12-09T17:28:02 08:00",
            "url": "https://gitee.com/oschina/webhook/commit/ac63b9ba95191a1bf79d60bc262851a66c12cda1",
            "author": {
                "name": "123",
                "email": "123@123.com",
                "time": "2016-12-09T17:28:02 08:00"
            }
        }
    ],
    "total_commits_count": 1,
    "commits_more_than_ten": false,
    "project": {
        "name": "webhook",
        "path": "webhook",
        "url": "https://gitee.com/oschina/webhook",
        "git_ssh_url": "git@gitee.com:oschina/webhook.git",
        "git_http_url": "https://gitee.com/oschina/webhook.git",
        "git_svn_url": "svn://gitee.com/oschina/webhook",
        "namespace": "oschina",
        "name_with_namespace": "oschina/webhook",
        "path_with_namespace": "oschina/webhook",
        "default_branch": "master"
    },
    "hook_name": "push_hooks",
    "password": "pwd"
}
 */
const { EventEmitter } = require('events');

const create = function(options) {
  if (typeof options != 'object') {
    throw new TypeError('must provide an options object');
  }
  if (typeof options.path != 'string') {
    throw new TypeError('must provide a \'path\' option');
  }
  if (typeof options.secret != 'string') {
    throw new TypeError('must provide a \'secret\' option');
  }
  var events;
  if (typeof options.events == 'string' && options.events != '*') {
    events = [ options.events ];
  } else if (Array.isArray(options.events) && options.events.indexOf('*') == -1) {
    events = options.events;
  }
  // Make it an EventEmitter, sort of
  handler.__proto__ = EventEmitter.prototype;
  EventEmitter.call(handler);

  handler.sign = sign;
  handler.verify = verify;

  return handler;

  function sign(data) {
    return 'sha1=' + crypto.createHmac('sha1', options.secret).update(data).digest('hex')
  }

  function verify(signature, data) {
    return bufferEq(Buffer.from(signature), Buffer.from(sign(data)))
  }

  function handler(req, res, callback) {
    if (req.url.split('?').shift() !== options.path || req.method !== 'POST') {
      return callback()
    }

    function hasError (msg) {
      res.writeHead(400, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ error: msg }));
      var err = new Error(msg)
      handler.emit('error', err, req)
      callback(err)
    }

    var sig   = req.headers['x-hub-signature']
      , event = req.headers['x-github-event']
      , id    = req.headers['x-github-delivery']

    if (!sig)
      return hasError('No X-Hub-Signature found on request')

    if (!event)
      return hasError('No X-Github-Event found on request')

    if (!id)
      return hasError('No X-Github-Delivery found on request')

    if (events && events.indexOf(event) == -1)
      return hasError('X-Github-Event is not acceptable')

    req.pipe(bl(function (err, data) {
      if (err) {
        return hasError(err.message)
      }

      var obj

      if (!verify(sig, data)) {
        return hasError('X-Hub-Signature does not match blob signature');
      }

      try {
        obj = JSON.parse(data.toString())
      } catch (e) {
        return hasError(e);
      }

      res.writeHead(200, { 'content-type': 'application/json' })
      res.end('{"ok":true}')

      var emitData = {
          event   : event
        , id      : id
        , payload : obj
        , protocol: req.protocol
        , host    : req.headers['host']
        , url     : req.url
      }

      handler.emit(event, emitData)
      handler.emit('*', emitData)
    }))
  }

};


module.exports = create;
