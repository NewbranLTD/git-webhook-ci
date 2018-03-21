/**
 * This is for wechat mini-app push callback
 * Based on their PHP version
 */
/*
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
// Main
class WechatHandler extends BaseTools {
  constructor(options) {
    super(options);
    this.options = options;
  }

  /**
   * This is different using the query parameter to compare
   */
  _verify(req) {
    const { query } = url.parse(req.url, true);
  }
}
// Export
module.exports = WechatHandler;
