const mongoose = require("mongoose");

const cartItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [cartItemSchema],
        total: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Cart', cartSchema);
