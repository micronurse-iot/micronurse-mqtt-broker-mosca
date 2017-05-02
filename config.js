/**
 * Created by shengyun-zhou on 17-3-4.
 */

var config = {
  mosca: {
    port: 13883
  },

  redis_store: {
    host: "localhost",
    port: 6379,
    db: 4,
    ttl: {
      subscriptions: 15 * 24 * 60 * 60 * 1000,       //15 days
      packets: 10 * 24 * 60 * 60 * 1000              //10 days
    }
  },

  mysql_db: {
    connectionLimit : 15,
    host            : 'localhost',
    user            : 'MicroNurse',
    password        : '7824af5833060c92e8e4wefb7a44c110ee47',
    database        : 'MicroNurse'
  },

  http_api_base_url_v1: 'http://localhost:13000/micronurse/v1/',    //DO NOT omit the last '/' separator 
};

var mqtt_topic_permission_matrix = {
  iot_account: {
    iot_anonymous_owner: 'r',
    iot_owner: 'r',
    web_server: 'w'
  },
  chatting_guardianship: {
    mobile_owner: 'r',
    mobile_guardianship: 'w',
  },
  chatting_friend: {
    mobile_owner: 'r',
    mobile_friend: 'w',
  },
  sensor_data_report: {
    iot_owner: 'w',
    web_server: 'r',
    mobile_owner: 'wr',
    mobile_guardianship: 'r',
  },
  sensor_warning: {
    web_server: 'w',
    mobile_owner: 'r',
    mobile_guardianship: 'r',
  },
  binding_request_message: {
    mobile_owner: 'r',
    web_server: 'w',
  },
  add_friends_request_message: {
    mobile_owner: 'r',
    web_server: 'w',
  },
  binding_response_message: {
    mobile_owner: 'r',
    web_server: 'w',
  },
  add_friends_response_message: {
    mobile_owner: 'r',
    web_server: 'w',
  }
};

module.exports={
  config: config,
  mqtt_topic_perm: mqtt_topic_permission_matrix,
};
