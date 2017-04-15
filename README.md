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

The format of full name of a topic is: `<topic_name>/[topic_owner_id]`

`topic_name`: the name of a topic.

`topic_owner_id`: (optional) the user ID of the owner of a topic, if any.

For example, the full name of a topic named `sensor_warning`, whose owner ID is `100`:

```
sensor_warning/100
```

## Topic R/W(Subscribe/Publish) Permission

For each topic, the permission limit apply to the following 6 roles:

`IoT Owner`: the owner of this topic from IoT-SOL client.

`Mobile Owner`: the owner of this topic from mobile client.

`Mobile Guardianship`: the user from mobile client who has a guardianship with the owner of this topic.

`Mobile Friend`: the user from mobile client who is a friend of the owner of this topic.

`Web Server` : the web server.

`Others`:  others.

You can set permission of all topics in `config.js`.