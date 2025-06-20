const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'DogWalkService',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
console.log("✅ CONNECTING TO DB:", pool.config.connectionConfig.database);


module.exports = pool;