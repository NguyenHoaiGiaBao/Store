const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');

// Route cho sản phẩm
router.route('/').post(createProduct).get(getProducts);
router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;
