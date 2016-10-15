CREATE DATABASE IF NOT EXISTS MicroNurse DEFAULT CHARACTER SET utf8;
USE MicroNurse;
DROP TABLE IF EXISTS topic_permission;
CREATE TABLE topic_permission(
  topic VARCHAR(40) NOT NULL PRIMARY KEY,
  iot_owner_perm VARCHAR(2),
  mobile_owner_perm VARCHAR(2),
  mobile_guardian_perm VARCHAR(2),
  mobile_receiver_perm VARCHAR(2),
  server_perm VARCHAR(2),
  others_perm VARCHAR(2)
);

INSERT INTO topic_permission(topic, iot_owner_perm, mobile_owner_perm, mobile_guardian_perm, server_perm)
    VALUES ('sensor_data_report', 'w', 'r', 'r', 'r');
INSERT INTO topic_permission(topic, mobile_owner_perm, mobile_guardian_perm, server_perm)
    VALUES ('sensor_warning', 'r', 'r', 'w');
INSERT INTO topic_permission(topic, mobile_owner_perm, mobile_receiver_perm)
    VALUES ('chatting', 'w', 'r');
