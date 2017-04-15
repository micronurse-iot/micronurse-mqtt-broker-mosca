#!/usr/bin/env bash

tmux new-session -d -s MicroNurse-MQTT \
 "unset SSH_CLIENT;
  unset SSH_CONNECTION;
  node ./mqtt-broker.js"

