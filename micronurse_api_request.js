/**
 * Created by shengyun-zhou on 5/20/16.
 */

exports.start_request = function (url, method, token, json_data, callback) {
  var req = require('request');

  var opt = {
    method: method,
    url: 'http://micronurse-webserver:13000/micronurse/v1' + url,
    json: true,
    timeout: 10000
  };

  if (json_data) {
    opt.body = json_data;
  }
  if (token) {
    opt.headers = {};
    opt.headers['Auth-Token'] = token;
  }
  req(opt, callback);
};