const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Hari123',
  database: 'finance_app'
});

module.exports = pool.promise();