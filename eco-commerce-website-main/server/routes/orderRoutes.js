const express = require('express');
const router = express.Router();
const { placeOrder, getSoldProducts } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, placeOrder);
router.get('/sold-products', getSoldProducts);

module.exports = router;