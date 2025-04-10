const asyncHandler = require("express-async-handler");
const Product = require('../models/productModel');

const createProduct = asyncHandler(async (req, res) => {
    const { name, brand, price, specifications, status, images, stock = 0, discount = 0 } = req.body;
    
    if (!name || !brand || !price || !specifications || !status || !images) {
        res.status(400);
        throw new Error("All required fields must be provided");
    }

    const product = await Product.create({ 
        name, brand, price, specifications, 
        status, images, stock, discount 
    });

    res.status(201).json(product);
});

const getProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({}).lean();
        console.log('Products from database:', products);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            message: "Error fetching products",
            error: error.message
        });
    }
});

const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Sản phẩm không tồn tại");
    }
    res.json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
        res.status(404);
        throw new Error("Sản phẩm không tồn tại");
    }
    res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Sản phẩm không tồn tại");
    }
    res.json({ message: "Sản phẩm đã được xóa" });
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
