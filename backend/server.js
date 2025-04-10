const app = require('./app');
const dbConnect = require('./config/dbConnect');
const net = require('net');
const port = process.env.PORT || 3100;

// Connect Database
dbConnect();

const findAvailablePort = (startPort) => {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });
        
        server.listen(startPort, () => {
            server.close(() => {
                resolve(startPort);
            });
        });
    });
};

const startServer = async () => {
    try {
        const availablePort = await findAvailablePort(port);
        app.listen(availablePort, () => {
            console.log(`Server is running on port ${availablePort}`);
            console.log('API Documentation:');
            console.log('/api/users - User management');
            console.log('/api/products - Product management');
            console.log('/api/cart - Cart management');
            console.log('/api/orders - Order management');
        }).on('error', (err) => {
            console.error('Server error:', err);
            process.exit(1);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
