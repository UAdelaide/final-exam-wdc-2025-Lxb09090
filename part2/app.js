const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports=app;
const app = require('./app');
const port = 8080;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DogWalkService',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
const express = require('express');
const router = express.Router();
const pool = require('../db');

// /api/walks/dogs
router.get('/dogs', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username
      FROM Dogs
      JOIN Users ON Dogs.owner_id = Users.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});
router.get('/walkrequests/open', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT
          WalkRequests.request_id,
          Dogs.name AS dog_name,
          WalkRequests.requested_time,
          WalkRequests.duration_minutes,
          WalkRequests.location,
          Users.username AS owner_username
        FROM WalkRequests
        JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
        JOIN Users ON Dogs.owner_id = Users.user_id
        WHERE WalkRequests.status = 'open'
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch open walk requests' });
    }
  });
  router.get('/walkers/summary', async (req, res) => {
    try {
      const [rows] = await pool.query(`
        SELECT
          u.username AS walker_username,
          COUNT(r.rating_id) AS total_ratings,
          ROUND(AVG(r.rating), 1) AS average_rating,
          COUNT(CASE WHEN w.status = 'completed' THEN 1 END) AS completed_walks
        FROM Users u
        LEFT JOIN WalkApplications a ON u.user_id = a.walker_id
        LEFT JOIN WalkRequests w ON a.request_id = w.request_id
        LEFT JOIN WalkRatings r ON a.request_id = r.request_id AND r.walker_id = u.user_id
        WHERE u.role = 'walker'
        GROUP BY u.username
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch walker summary' });
    }
  });

  module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'User route placeholder' });
});

module.exports = router;
