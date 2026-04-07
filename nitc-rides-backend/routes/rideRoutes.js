const express = require('express');
const { startRide, getActiveRides, completeRide, getMyStats } = require('../controllers/rideController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Define the POST route to start a ride
// Notice how verifyToken is placed in the middle! 
// This forces the request to pass through the security guard before reaching startRide.
router.post('/start', verifyToken, startRide);

// Define the GET route for users to see available rides
router.get('/active', verifyToken, getActiveRides);

// Define the POST route to complete a ride
router.post('/complete', verifyToken, completeRide);

// GET driver stats (trips today + active ride)
router.get('/my-stats', verifyToken, getMyStats);

module.exports = router;
