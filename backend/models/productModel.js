const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Vui lòng nhập tên sản phẩm!"],
        },
        brand: {
            type: String,
            required: [true, "Vui lòng nhập thương hiệu!"],
        },
        price: {
            type: Number,
            required: [true, "Vui lòng nhập giá sản phẩm!"],
        },
        specifications: {
            type: String,
            required: [true, "Vui lòng nhập thông số kỹ thuật!"],
        },
        status: {
            type: String,
            enum: ['new', 'used', 'like new'],
            required: [true, "Vui lòng nhập tình trạng sản phẩm!"],
        },
        images: {
            type: [String],
            required: [true, "Vui lòng nhập hình ảnh sản phẩm!"],
        },
        stock: {
            type: Number,
            required: [true, "Vui lòng nhập số lượng tồn kho!"],
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);