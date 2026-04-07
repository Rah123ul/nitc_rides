const express = require('express');
const { bookRide } = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Define the POST route for a student to join a ride
// Notice how we place the EXACT SAME security guard (verifyToken) here.
// Because we wrote solid middleware earlier, we can reuse it infinitely to lock down routes.
router.post('/join', verifyToken, bookRide);

module.exports = router;
