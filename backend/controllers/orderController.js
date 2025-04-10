const asyncHandler = require("express-async-handler");
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const createOrder = asyncHandler(async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items?.length || !shippingAddress || !paymentMethod) {
        res.status(400);
        throw new Error("Missing required order information");
    }

    // Kiểm tra stock product
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product || product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Vượt quá số lượng tồn kho ${product?.name || item.product}`);
        }
    }

    const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const order = await Order.create({
        user: req.user.id,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod
    });

    // Cập nhật stock
    for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
        });
    }
    
    res.status(201).json(order);
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );
    if (!order) {
        res.status(404);
        throw new Error("Đơn hàng không tồn tại");
    }
    res.json(order);
});

module.exports = { createOrder, getOrders, updateOrderStatus };
