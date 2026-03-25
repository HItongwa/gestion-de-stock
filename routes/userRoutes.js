const express = require('express');
const router = express.Router();
const User = require('../models/User');

// CREATE USER
router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// GET USERS
router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

module.exports = router;
