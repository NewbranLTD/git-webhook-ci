/**
 * This is for wechat mini-app push callback
 * Based on their PHP version
 */
/*
https://mp.weixin.qq.com/debug/wxadoc/dev/api/custommsg/callback_help.html

private function checkSignature()
{
    $signature = $_GET["signature"];
    $timestamp = $_GET["timestamp"];
    $nonce = $_GET["nonce"];

    $token = TOKEN;
    $tmpArr = array($token, $timestamp, $nonce);
    sort($tmpArr, SORT_STRING);
    $tmpStr = implode( $tmpArr );
    $tmpStr = sha1( $tmpStr );

    if( $tmpStr == $signature ){
        return true;
    }else{
        return false;
    }
}
*/
const BaseTools = require('../lib/base-tools');
const sha1 = require('sha1');
const url = require('url');
const debug = require('debug')('git-webhook-ci:wechat');
// Main
class WechatHandler extends BaseTools {
  constructor(options) {
    super(options);
    this.options = options;
  }

  /**
   * Main interface, this is different from the other because there is no filter
   * on what is coming, just verify it then pass the payload to the callback
   */
  handler(req, res, callback) {
    if (this.options.inited === false) {
      const echostr = this._verify(req);
      if (!echostr) {
        debug('verify with wechat server failed');
        return callback();
      }
      debug(`verify with wechat echostr '${echostr}' correct`);
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(echostr);
      return;
    }
    // The implementation is different
    this._parsePayload(req).then(payload => {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end('{"ok": true}');
      // Just reuse the same naming
      this.emit('push', {
        payload,
        host: req.headers.host,
        event: 'wechat-push'
      });
    });
  }

  /**
   * This is different using the query parameter to compare
   * Another thing is - this is a one off verify process
   * once the wechat end verify this end is correct, it will
   * just send data over. Need to figure out a way to run this
   * verify before the actual listening
   */
  _verify(req) {
    const { query } = url.parse(req.url, true);
    const { signature, timestamp, nonce, echostr } = query;
    const $token = this.options.secret;
    let $tmpArr = [$token, timestamp, nonce];
    $tmpArr.sort();
    return sha1($tmpArr.join('')) === signature ? echostr : false;
  }
}
// Export
module.exports = WechatHandler;
