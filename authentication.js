/**
 * Created by zhou-shengyun on 16-10-7.
 */

var USER_TYPE_WEBSERVER = 'micronurse_webserver_user';
var USER_TYPE_IOT = 'micronurse_iot_user';
var USER_TYPE_MOBILE = 'micronurse_mobile_user';

var logger = require('./log').logger;
logger.setLevel('INFO');
var request = require('./micronurse_api_request');

var authenticate_connection = function(client, username, password, callback) {
  var authorized = false;
  var url = undefined;
  try{
    var user_type = username.split(':')[0];
    var user_id = username.split(':')[1];
    switch (user_type){
      case USER_TYPE_WEBSERVER:
        //Hard code to simply checking
        if(user_id == 'admin' && password.toString() == '123456')
          authorized = true;
        break;
      case USER_TYPE_IOT:
        url = '/iot/check_login/' + user_id;
        break;
      case USER_TYPE_MOBILE:
        url = '/mobile/account/check_login/' + user_id;
        break;
    }
  }catch (err){
    logger.error(err)
  }
  if(url){
    request.start_request(url, 'GET', password.toString(), undefined, function (error, res, data) {
      if(!error){
        if(res.statusCode == 200 && data.result_code == 0)
          authorized = true;
      }
      on_authenticate_connection_finished(authorized, username, user_id, user_type, client, callback);
    });
  }else {
    on_authenticate_connection_finished(authorized, username, user_id, user_type, client, callback);
  }
};

function on_authenticate_connection_finished(authorized, username, user_id, user_type, client, callback) {
  if (authorized) {
    client.user = user_id;
    client.user_type = user_type;
    logger.info('Succeed to authenticate user <' + username+ '>');
  } else
    logger.error('Failed to authenticate user <' + username + '>');
  callback(null, authorized);
}

module.exports={
  authenticate: authenticate_connection
};
