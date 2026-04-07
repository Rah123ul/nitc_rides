// Import required modules
const express = require('express');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

// Initialize the Express application
const app = express();

// Enable CORS — allow all origins in development
// In production, replace '*' with your frontend URL
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));

// Middleware to parse incoming JSON data
app.use(express.json());

// Load and connect to MongoDB
const connectDB = require('./config/db');
connectDB(); 

// Import the routes
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const rideRoutes = require('./routes/rideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Use the routes for endpoints
app.use('/api/auth', authRoutes);
app.use('/api/routes', locationRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);

// Set the port (reads from .env in production, defaults to 5000 locally)
const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
