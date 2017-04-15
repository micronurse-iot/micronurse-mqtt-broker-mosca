/**
 * Created by zhou-shengyun on 16-10-5.
 */
var mosca = require('mosca');
var config = require('./config').config;
var logger = require('./log').logger;
logger.setLevel('INFO');
var authentication = require('./authentication');
var db_util = require('./database_utils');

var server = new mosca.Server(config.mosca);

var db = mosca.persistence.Redis(config.redis_store, function () {});
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
