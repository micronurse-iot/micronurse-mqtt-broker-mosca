/**
 * Created by zhou-shengyun on 16-10-7.
 */

var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 15,
  host            : 'localhost',
  user            : 'MicroNurse',
  password        : '7824af5833060c92e8e4wefb7a44c110ee47',
  database        : 'MicroNurse'
});

var query_guardianship = function (older_id, guardian_id, callback) {
  pool.query('SELECT * FROM guardianship WHERE older_id=? AND guardian_id=?',
    [older_id, guardian_id], callback);
};

var query_topic_permission = function (topic, callback) {
  pool.query('SELECT * FROM topic_permission WHERE topic=?', [topic], callback);
};

module.exports={
  close_db: function () {
    pool.end();
  },
  query_guardianship: query_guardianship,
  query_topic_permission: query_topic_permission
};
