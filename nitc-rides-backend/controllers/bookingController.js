const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

const bookRide = async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied. Only students can book rides.' });
    }

    const { ride_id, pickup_location, dropoff_location } = req.body;
    const student_id = req.user.id;

    if (!ride_id || !pickup_location || !dropoff_location) {
        return res.status(400).json({ error: 'Please provide ride_id, pickup_location, and dropoff_location.' });
    }

    try {
        const ride = await Ride.findById(ride_id).populate('route_id');
        
        let base_fare = 0;
        if (!ride.route_id) {
            const Route = require('../models/Route');
            const routeDoc = await Route.findOne({
                start_location: new RegExp(`^${pickup_location.trim()}$`, 'i'),
                end_location: new RegExp(`^${dropoff_location.trim()}$`, 'i')
            });
            if (!routeDoc) return res.status(400).json({ error: 'Route not found in database.' });
            base_fare = routeDoc.base_fare;
        } else {
            // let's strictly validate if driver's fixed route is same as requested pickup/dropoff
            if (
                ride.route_id.start_location.trim().toLowerCase() !== pickup_location.trim().toLowerCase() ||
                ride.route_id.end_location.trim().toLowerCase() !== dropoff_location.trim().toLowerCase()
            ) {
                return res.status(400).json({ 
                    error: `Route mismatch! The driver is designated for ${ride.route_id.start_location} to ${ride.route_id.end_location}.` 
                });
            }
            base_fare = ride.route_id.base_fare;
        }

        const newPassengersCount = ride.current_passengers + 1;
        const driverTotal = base_fare + ((newPassengersCount - 1) * 10);
        const perPersonFare = Number((driverTotal / newPassengersCount).toFixed(2));

        const newBooking = await Booking.create({
            user_id: student_id,
            ride_id: ride_id,
            pickup_location,
            dropoff_location,
            per_person_fare: perPersonFare, // Projected fare
            status: 'pending'
        });

        res.status(201).json({
            message: 'Ride booking requested! Waiting for driver confirmation...',
            booking_id: newBooking._id,
            status: 'pending'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create booking in database.' });
    }
};

const getBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found.' });
        }
        if (booking.user_id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to view this booking.' });
        }
        res.status(200).json({ status: booking.status, id: booking._id, per_person_fare: booking.per_person_fare });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch booking status.' });
    }
};

const getPendingBookings = async (req, res) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ error: 'Only drivers can view pending requests.' });
    }

    try {
        const activeRide = await Ride.findOne({ driver_id: req.user.id, status: 'active' });
        if (!activeRide) {
            return res.status(404).json({ error: 'You do not have an active ride.' });
        }

        const pendingBookings = await Booking.find({ ride_id: activeRide._id, status: 'pending' })
            .populate('user_id', 'name phone');

        res.status(200).json({ count: pendingBookings.length, bookings: pendingBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch pending bookings.' });
    }
};

const confirmBooking = async (req, res) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ error: 'Only drivers can confirm bookings.' });
    }

    const { booking_id } = req.body;
    if (!booking_id) return res.status(400).json({ error: 'Please provide booking_id.' });

    try {
        const booking = await Booking.findById(booking_id);
        if (!booking || booking.status !== 'pending') {
            return res.status(404).json({ error: 'Pending booking not found.' });
        }

        const ride = await Ride.findOne({ _id: booking.ride_id, driver_id: req.user.id, status: 'active' }).populate('route_id');
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found or not currently active.' });
        }

        if (ride.current_passengers >= ride.max_seats) {
            // Automatically reject since full
            booking.status = 'rejected';
            await booking.save();
            return res.status(400).json({ error: 'Ride is already full. Booking has been auto-rejected.' });
        }

        let base_fare = 0;
        if (!ride.route_id) {
            const Route = require('../models/Route');
            const routeDoc = await Route.findOne({
                start_location: new RegExp(`^${booking.pickup_location.trim()}$`, 'i'),
                end_location: new RegExp(`^${booking.dropoff_location.trim()}$`, 'i')
            });
            if (!routeDoc) return res.status(400).json({ error: 'Route lookup failed.' });
            
            ride.route_id = routeDoc._id;
            await ride.save(); // lock the route!
            base_fare = routeDoc.base_fare;
        } else {
            base_fare = ride.route_id.base_fare;
        }

        const newPassengersCount = ride.current_passengers + 1;
        const driverTotal = base_fare + ((newPassengersCount - 1) * 10);
        const perPersonFare = Number((driverTotal / newPassengersCount).toFixed(2));

        // Use Atomic update to prevent race conditions on seats
        const updatedRide = await Ride.findOneAndUpdate(
            { _id: ride._id, current_passengers: { $lt: ride.max_seats }, status: 'active' },
            { $inc: { current_passengers: 1 } },
            { new: true }
        );

        if (!updatedRide) {
            return res.status(400).json({ error: 'Booking failed. Seats filled up while processing.' });
        }

        // Update all other confirmed bookings for this ride to the new lowered fare
        await Booking.updateMany(
            { ride_id: ride._id, status: 'confirmed' },
            { $set: { per_person_fare: perPersonFare } }
        );

        // Confirm this booking
        booking.status = 'confirmed';
        booking.per_person_fare = perPersonFare;
        await booking.save();

        res.status(200).json({
            message: 'Booking confirmed successfully!',
            total_passengers_now: updatedRide.current_passengers,
            new_per_person_fare: perPersonFare
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to confirm booking.' });
    }
};

const rejectBooking = async (req, res) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ error: 'Only drivers can reject bookings.' });
    }

    const { booking_id } = req.body;
    if (!booking_id) return res.status(400).json({ error: 'Please provide booking_id.' });

    try {
        const booking = await Booking.findById(booking_id);
        if (!booking || booking.status !== 'pending') {
            return res.status(404).json({ error: 'Pending booking not found.' });
        }

        const ride = await Ride.findOne({ _id: booking.ride_id, driver_id: req.user.id, status: 'active' });
        if (!ride) {
            return res.status(404).json({ error: 'Ride not found or not active.' });
        }

        booking.status = 'rejected';
        await booking.save();

        res.status(200).json({ message: 'Booking rejected successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reject booking.' });
    }
};

module.exports = {
    bookRide,
    getBookingStatus,
    getPendingBookings,
    confirmBooking,
    rejectBooking
};
