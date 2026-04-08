const express = require('express');
const { bookRide, getBookingStatus, getPendingBookings, confirmBooking, rejectBooking } = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Define the POST route for a student to join a ride
router.post('/join', verifyToken, bookRide);

// Define route for checking booking status
router.get('/status/:id', verifyToken, getBookingStatus);

// Driver endpoints for managing bookings
router.get('/driver/pending', verifyToken, getPendingBookings);
router.post('/driver/confirm', verifyToken, confirmBooking);
router.post('/driver/reject', verifyToken, rejectBooking);

module.exports = router;
