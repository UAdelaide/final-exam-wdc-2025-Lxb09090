// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'dogwalk-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Routes
const userRoutes = require('./userRoutes');
const walkRoutes = require('./walkRoutes');
const loginRoutes = require('./loginRoutes');

app.use('/api/users', userRoutes);
app.use('/api/walks', walkRoutes);
app.use('/', loginRoutes);

module.exports = app;

