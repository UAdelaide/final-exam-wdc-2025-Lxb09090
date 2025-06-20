var express = require('express');
var router = express.Router();
const mysql = require('mysql2/promise');

// 创建数据库连接池（根据你自己的密码修改）
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // ← 修改为你的 MySQL 密码
  database: 'dogwalks'
});

/* GET /api/dogs */
router.get('/api/dogs', async function (req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT dogs.name AS dog_name, dogs.size, owners.username AS owner_username
      FROM dogs
      JOIN owners ON dogs.owner_id = owners.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET /api/walkrequests/open */
router.get('/api/walkrequests/open', async function (req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT wr.id AS request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location,
             o.username AS owner_username
      FROM walk_requests wr
      JOIN dogs d ON wr.dog_id = d.id
      JOIN owners o ON d.owner_id = o.id
      WHERE wr.status = 'open'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/api/walkers/summary', async function (req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT w.username AS walker_username,
             COUNT(r.rating) AS total_ratings,
             ROUND(AVG(r.rating), 1) AS average_rating,
             SUM(CASE WHEN wr.status = 'completed' THEN 1 ELSE 0 END) AS completed_walks
      FROM walkers w
      LEFT JOIN walk_requests wr ON w.id = wr.walker_id
      LEFT JOIN ratings r ON wr.id = r.walk_request_id
      GROUP BY w.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
