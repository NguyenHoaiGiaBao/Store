const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').post(createOrder).get(getOrders);
router.route('/:id/status').put(updateOrderStatus);

module.exports = router;
