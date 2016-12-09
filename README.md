# micronurse-mqtt-broker-mosca
The MQTT broker of Micro Nurse IoT application based on [Mosca](https://github.com/mcollina/mosca).

## Prerequisite

+ [Node.js](https://nodejs.org/)(with NPM) (>=4.4.0)
+ [Redis](http://redis.io/)
+ MySQL

## Build and Run
First, Add host name `micronurse-webserver`, which refer to the host running [Micro Nurse Web Server](https://github.com/micronurse-iot/micronurse-webserver-django), to `hosts` of your system. For example:

```
127.0.0.1	micronurse-webserver
```

Switch to the root directory of this project, execute following command to install all required Node.js modules:

```bash
npm install
```

Then, execute following command to run broker:
```bash
node mqtt-broker.js
```

Press `Ctrl+C` to stop broker. 

## Start Server at Backend

You can execute `start_server.sh`  in root directory of project directly to start server at backend.

## Sync Code to Remote Host

You can use `sync.sh` in root directory of project to sync your code to remote host. This script will sync your code via command  `rsync`.

Basic usage of `sync.sh`:

```shell
sync.sh ${REMOTE_HOST}
```

`$REMOTE_HOST` refer to address of remote host that you want to sync code to.

By default, remote user is `root`, and syncing path on remote host is `/root/micronurse-mqtt-broker`.

## MQTT Authentication

If a client want to connect to broker, it must provide client ID, and correct user name and password.

NOTE: the client ID must be the same as user name.

The format of client ID/user name is: `<client_type>:<user_id>`

`client_type` must be one of the following 3 values:

+ micronurse_webserver_user (For web server)

+ micronurse_iot_user (For IoT-SOL client)

+ micronurse_mobile_user (For mobile client)

For example, the client ID/user name of  a client with user ID `100` from IoT-SOL:

```
micronurse_iot_user:100
```

For IoT-SOL client and mobile client, the password is the corresponding **`token`** of the user.

## Topic

The format of full name of a topic is: `<topic_name>/[receiver_id]/[topic_user_id]`

`topic_name`: the name of a topic.

`receiver_id`: (optional) the user ID of the specific receiver of a topic, if any.

`topic_user_id`: (optional) the user ID of the owner of a topic, if any.

For example, the full name of a topic named `sensor_warning`, whose owner ID is `100`:

```
sensor_warning/100
```

the full name of a topic named 	`chatting`, whose owner ID is `100` and receiver ID is `101`:

```
chatting/101/100
```

## Topic R/W(Subscribe/Publish) Permission

For each topic, the permission limit apply to the following 6 roles:

`IoT Owner`: the owner of this topic from IoT-SOL client.

`Mobile Owner`: the owner of this topic from mobile client.

`Mobile Guardian`: the guardian of the owner of this topic from mobile client.

`Mobile Receiver`: the receiver of this topic from mobile client.

`Server` : the web server.

`Others`:  others.

You can find permission info of all topics in `init_db.sql`. 