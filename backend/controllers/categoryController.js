const asyncHandler = require("express-async-handler");
const Category = require('../models/categoryModel');

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
});

const getCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.json(category);
});

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }
    res.json({ message: 'Category removed' });
});

module.exports = {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
};
