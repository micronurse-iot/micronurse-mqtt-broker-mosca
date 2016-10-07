/**
 * Created by zhou-shengyun on 16-10-5.
 */
var mosca = require('mosca');
var logger = require('./log').logger;
logger.setLevel('INFO');
var authentication = require('./authentication');
var db_util = require('./database_utils');

var redis_store_opts = {
  host: "micronurse-webserver",
  port: 6379,
  db: 6,
  ttl: {
    subscriptions: 5 * 24 * 60 * 60 * 1000,       //5 days
    packets: 5 * 24 * 60 * 60 * 1000              //5 days
  }
};

var mosca_settings = {
  port: 13883
};

var server = new mosca.Server(mosca_settings);

var db = mosca.persistence.Redis(redis_store_opts, function () {
});
db.wire(server);

server.on('ready', setup);

server.on('clientConnected', function(client) {
  logger.info('Client connected: <' + client.id + '>');
});

server.on('published', function (packet, client) {
  if(client) {
    logger.info('Publish from client: <' + client.id + '>');
    logger.info('Published message:' + packet.payload.toString());
  }
});

server.on('delivered', function (packet, client) {
  logger.info('Send to client <' + client.id + '>');
  logger.info('Sent message:' + packet.payload.toString());
});

server.on('subscribed', function (topic, client) {
  logger.info('Client <' + client.id + '> has subscribed on topic <' + topic + '>');
});

server.on('clientDisconnected', function(client) {
  logger.info('Client Disconnected: <' + client.id + '>');
});

function setup() {
  logger.info('Mosca server is up and running...');
  server.authenticate = authentication.authenticate;
  server.authorizePublish = authentication.authorize_publish;
  server.authorizeSubscribe = authentication.authorize_subscribe;
}

process.on('SIGINT', function(){
  logger.info('Mosca server is stoping...');
  db_util.close_db();
  server.close();
  process.exit(0);
});
