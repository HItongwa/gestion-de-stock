const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

router.post('/', produitController.createProduct);
router.get('/', produitController.getProducts);

module.exports = router;
