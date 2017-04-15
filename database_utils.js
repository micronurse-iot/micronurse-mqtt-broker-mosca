/**
 * Created by zhou-shengyun on 16-10-7.
 */

var mysql = require('mysql');
var config = require('./config').config;
var pool  = mysql.createPool(config.mysql_db);

var query_guardianship = function (older_id, guardian_id, callback, swap_flag) {
  pool.query('SELECT * FROM guardianship WHERE older_id=? AND guardian_id=?',
    [older_id, guardian_id], function (err, rows, fields) {
      if(!err && rows.length <= 0 && !swap_flag){
        query_guardianship(guardian_id, older_id, callback, true);
        return;
      }
      callback(err, rows, fields);
    });
};

var query_friendship = function (older_id, friend_id, callback, swap_flag) {
  pool.query('SELECT * FROM friendship WHERE older_id=? AND friend_id=?',
    [older_id, friend_id], function (err, rows, fields) {
      if(!err && rows.length <= 0 && !swap_flag){
        query_friendship(friend_id, older_id, callback, true);
        return;
      }
      callback(err, rows, fields);
    });
};

module.exports={
  close_db: function () {
    pool.end();
  },
  query_guardianship: query_guardianship,
  query_friendship: query_friendship,
};
