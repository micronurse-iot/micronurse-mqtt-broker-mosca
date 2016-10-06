#!/bin/bash

rsync --recursive --copy-links --perms --times --delete --progress --human-readable --exclude=*.log --exclude=.idea * root@101.200.144.204:~/micronurse-mqtt-broker

