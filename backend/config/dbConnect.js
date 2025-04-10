const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database connected successfully!");
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};

module.exports = dbConnect;
