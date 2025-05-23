const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCategories)
    .post(protect, createCategory);

router.route('/:id')
    .get(getCategory)
    .put(protect, updateCategory)
    .delete(protect, deleteCategory);

module.exports = router;
