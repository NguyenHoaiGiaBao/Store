const express = require('express');
const cors = require('cors');
const net = require('net');
const app = express();
const contactRouter = require('./routes/contactRouter');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const categoryRouter = require('./routes/categoryRouter');
const cartRouter = require('./routes/cartRouter');
const orderRouter = require('./routes/orderRouter');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();
const port = process.env.PORT || 3100;
const dbConnect = require('./config/dbConnect')

//Connect Database
dbConnect();

// Middleware
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:8081'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Contact Manager Project');
});
// Routes
app.use('/api/contacts', contactRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

// Error handlers
app.use(errorHandler);
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = app;
