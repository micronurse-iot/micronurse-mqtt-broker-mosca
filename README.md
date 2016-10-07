# micronurse-mqtt-broker-mosca
The MQTT broker of Micro Nurse IoT application based on [Mosca](https://github.com/mcollina/mosca).

## Prerequisite

+ [Nodejs](https://nodejs.org/)(with NPM) (>=4.4.0)
+ [Redis](http://redis.io/)
+ MySQL

## Build and Run
Switch to the root directory of this project, execute following command to install all required Node modules:

```bash
npm install
```

Then, execute following command to run broker:
```bash
node mqtt-broker.js
```

Press `Ctrl+C` to stop broker. 
