# micronurse-mqtt-broker-mosca
The MQTT broker of Micro Nurse IoT application based on [Mosca](https://github.com/mcollina/mosca).

## Prerequisite

+ [Node.js](https://nodejs.org/)(with NPM) (>=4.4.0)
+ [Redis](http://redis.io/)
+ MySQL

## Build and Run
Execute following command to install all required Node.js modules:

```bash
npm install
```

Then, execute following command to run broker:
```bash
node mqtt-broker.js
```

Press `Ctrl+C` to stop broker. 

## Configuration

All configurations are in `config.js`, including Redis and MySQL connection configurations, Mosca configurations, MQTT topic R/W permission configurations and so on.

## Start Server at Backend

You can execute `start_server.sh` to start server at backend directly.

And you can execute `tmux attach -t MicroNurse-MQTT` to view the log in real time.

## Sync Code to Remote Host

You can use `sync.sh` to sync your code to remote host. This script will sync your code via `rsync`.

Write into `sync_config.sh` as below to configure it.

```shell
remote_user=root
remote_path=/home/root/micronurse-mqtt-broker
remote_host=127.0.0.1
```

Lines in `sync_config.sh` will override the configuration set in `sync.sh`.

After that, you could sync your code.

## MQTT Connection Authentication

A client must provide a valid client ID, correct user name and password to connect to broker.

NOTE: the client ID must be the same as user name.

The format of client ID/user name is: `<client_type>:<user_id>`

`client_type` must be one of the following values:

+ `micronurse_webserver_user`: user from web server.
+ `micronurse_iot_user`: user from IoT-SOL client.
+ `micronurse_iot_anonymous_user`: Anonymous user from IoT-SOL client. Before connecting, the anonymous user must apply for a temporary user ID from web server.
+ `micronurse_mobile_user`: user from mobile client.

For example, the client ID/user name of  a client with user ID `100` from IoT-SOL:

```
micronurse_iot_user:100
```

For user from IoT-SOL client and mobile client, the password is the corresponding **`token`**.

## Topic

The format of full name of a topic is: `<topic_name>/[topic_owner_id]`

`topic_name`: the name of a topic.

`topic_owner_id`: (optional) the user ID of the owner of a topic, if any.

For example, the full name of a topic named `sensor_warning`, whose owner ID is `100`:

```
sensor_warning/100
```

## Topic R/W(Subscribe/Publish) Permission

For each topic, the permission limit apply to the following roles:

`IoT Owner`: the owner of this topic from IoT-SOL client.

`IoT Anonymous Owner `: the owner(anonymous user) of this topic from IoT-SOL client.

`Mobile Owner`: the owner of this topic from mobile client.

`Mobile Guardianship`: the user from mobile client who has a guardianship with the owner of this topic.

`Mobile Friend`: the user from mobile client who is a friend of the owner of this topic.

`Web Server` : the web server.

`Others`:  others.

You can set permission of all topics in `config.js`.