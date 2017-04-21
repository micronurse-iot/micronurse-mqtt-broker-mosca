/**
 * Created by zhou-shengyun on 16-10-7.
 */

var USER_TYPE_WEBSERVER = 'micronurse_webserver_user';
var USER_TYPE_IOT = 'micronurse_iot_user';
var USER_TYPE_IOT_ANONYMOUS = 'micronurse_iot_anonymous_user';
var USER_TYPE_MOBILE = 'micronurse_mobile_user';

var logger = require('./log').logger;
logger.setLevel('INFO');
var request = require('./micronurse_api_request');
var db_util = require('./database_utils');
var topic_perm = require('./config').mqtt_topic_perm;

var authenticate_connection = function(client, username, password, callback) {
  var authorized = false;
  var url = undefined;
  if(client.id !== username) {
    on_authenticate_connection_finished(false, username, null, null, client, callback);
    return;
  }
  try{
    var user_type = username.split(':')[0];
    var user_id = username.substring(user_type.length + 1);
    if(!user_id) {
      on_authenticate_connection_finished(false, username, null, null, client, callback);
      return;
    }
    switch (user_type){
      case USER_TYPE_WEBSERVER:
        //Hard code to simply checking
        if(user_id == 'admin' && password.toString() == '123456')
          authorized = true;
        break;
      case USER_TYPE_IOT:
        url = 'iot/check_login/' + user_id;
        break;
      case USER_TYPE_IOT_ANONYMOUS:
        url = 'iot/check_anonymous/' + user_id;
        break;
      case USER_TYPE_MOBILE:
        url = 'mobile/account/check_login/' + user_id;
        break;
    }
  }catch (err){
    logger.error(err)
  }
  if(url){
    request.start_request(url, 'GET', password.toString(), undefined, function (error, res, data) {
      if(!error){
        if(res.statusCode === 200 && data.result_code === 0)
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

function check_permission(client, topic, wr_perm, callback) {
  var async_flag = false;
  var perm_type = 'others';
  var topic_user = undefined;
  var topic_split = topic.split('/');
  topic = topic_split[0];
  if(topic_split.length > 1) {
    topic_user = topic_split[1];
    if(topic_split.length > 2){
      on_authorize_finished(false, client, topic, wr_perm, callback);
      return;
    }
  }
  if(!topic_perm[topic]){
    on_authorize_finished(false, client, topic, wr_perm, callback);
    return;
  }

  switch(client.user_type){
    case USER_TYPE_WEBSERVER:
      perm_type = 'web_server';
      break;
    case USER_TYPE_IOT_ANONYMOUS:
      if(client.user && client.user === topic_user)
        perm_type = 'iot_anonymous_owner';
      break;
    case USER_TYPE_IOT:
      if(client.user && client.user === topic_user)
        perm_type = 'iot_owner';
      break;
    case USER_TYPE_MOBILE:
      if(client.user && client.user === topic_user)
        perm_type = 'mobile_owner';
      else{
        async_flag = true;
        db_util.query_guardianship(topic_user, client.user, function (err, rows, fields) {
          if (err || rows.length <= 0) {
            if (err)
              logger.error(err);
            db_util.query_friendship(topic_user, client.user, function (err, rows, fields) {
              if (err || rows.length <= 0) {
                if (err)
                  logger.error(err);
              }else{
                perm_type = 'mobile_friend';
              }
              check_permission_type(topic, perm_type, wr_perm, client, callback);
            });
          } else {
            perm_type = 'mobile_guardianship';
            check_permission_type(topic, perm_type, wr_perm, client, callback);
          }
        });
      }
      break;
  }
  if(!async_flag)
    check_permission_type(topic, perm_type, wr_perm, client, callback);
}

function check_permission_type(topic, perm_type, wr_perm, client, callback) {
  if(topic_perm[topic][perm_type] && topic_perm[topic][perm_type].toLowerCase().indexOf(wr_perm) >= 0)
    on_authorize_finished(true, client, topic, wr_perm, callback);
  else
    on_authorize_finished(false, client, topic, wr_perm, callback);
}

function on_authorize_finished(authorized, client, topic, wr_perm, callback) {
  switch (wr_perm){
    case 'w':
      if(authorized)
        logger.info('User <' + client.user_type + ':' + client.user + '> can publish on topic <' + topic + '>');
      else
        logger.error('User <' + client.user_type + ':' + client.user + '> have no permission to publish on topic <' + topic + '>');
      break;
    case 'r':
      if(authorized)
        logger.info('User <' + client.user_type + ':' + client.user + '> can receive messages on topic <' + topic + '>');
      else
        logger.error('User <' + client.user_type + ':' + client.user + '> have no permission to receive messages on topic <' + topic + '>');
  }
  callback(null, authorized);
}

var authorize_publish = function(client, topic, payload, callback) {
  check_permission(client, topic, 'w', callback);
};

var authorize_subscribe = function(client, topic, callback) {
  check_permission(client, topic, 'r', callback);
};

module.exports={
  authenticate: authenticate_connection,
  authorize_publish: authorize_publish,
  authorize_subscribe: authorize_subscribe
};
