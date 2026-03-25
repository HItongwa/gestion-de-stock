const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// CREATE PRODUCT
router.post('/', async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// GET PRODUCTS
router.get('/', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

module.exports = router;
