import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import blueprintRoutes from './routes/blueprints.js';
import contractRoutes from './routes/contracts.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/contract-management';

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Contract Management API',
        version: '1.0.0',
        endpoints: {
            blueprints: '/api/blueprints',
            contracts: '/api/contracts'
        }
    });
});

app.use('/api/blueprints', blueprintRoutes);
app.use('/api/contracts', contractRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✓ Connected to MongoDB');
        console.log(`✓ Database: ${MONGODB_URI}`);

        // Start server
        app.listen(PORT, () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ API available at http://localhost:${PORT}/api`);
            console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    })
    .catch((error) => {
        console.error('✗ MongoDB connection error:', error);
        process.exit(1);
    });

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});
