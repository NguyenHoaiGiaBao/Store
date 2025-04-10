const asyncHandler = require("express-async-handler");
const Cart = require('../models/cartModel');

const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
        const newCart = await Cart.create({ user: req.user.id, items: [], total: 0 });
        return res.json(newCart);
    }
    res.json(cart);
});

const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
        cart = await Cart.create({ 
            user: req.user.id, 
            items: [{ product: productId, quantity }],
            total: 0
        });
    } else {
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
    }
    
    await cart.save();
    res.json(cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOneAndUpdate(
        { user: req.user.id, "items.product": productId },
        { "$set": { "items.$.quantity": quantity } },
        { new: true }
    );
    res.json(cart);
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const cart = await Cart.findOneAndUpdate(
        { user: req.user.id },
        { "$pull": { items: { product: productId } } },
        { new: true }
    );
    res.json(cart);
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
