const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Vui lòng nhập tên người dùng"],
            unique: true
        },
        email: {
            type: String,
            required: [true, "Vui lòng nhập email"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Vui lòng nhập mật khẩu"],
        },
        phone: {
            type: String,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
