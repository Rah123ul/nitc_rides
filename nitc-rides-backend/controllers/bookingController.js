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
        
        if (!ride || !ride.route_id) {
            return res.status(404).json({ error: 'Ride not found.' });
        }

        if (ride.status !== 'active') {
            return res.status(400).json({ error: 'Sorry, this ride is no longer active.' });
        }

        if (ride.current_passengers >= ride.max_seats) {
            return res.status(400).json({ error: 'Sorry, this vehicle is completely full!' });
        }

        const newPassengersCount = ride.current_passengers + 1;
        const driverTotal = ride.route_id.base_fare + ((newPassengersCount - 1) * 10);
        const perPersonFare = Number((driverTotal / newPassengersCount).toFixed(2));

        // Use Atomic update to prevent race conditions on seats
        const updatedRide = await Ride.findOneAndUpdate(
            { _id: ride_id, current_passengers: { $lt: ride.max_seats }, status: 'active' },
            { $inc: { current_passengers: 1 } },
            { new: true }
        );

        if (!updatedRide) {
            return res.status(400).json({ error: 'Booking failed. Seats filled up while processing.' });
        }

        // Update all other bookings for this ride to the new lowered fare
        await Booking.updateMany(
            { ride_id },
            { $set: { per_person_fare: perPersonFare } }
        );

        const newBooking = await Booking.create({
            user_id: student_id,
            ride_id: ride_id,
            pickup_location,
            dropoff_location,
            per_person_fare: perPersonFare,
            status: 'confirmed'
        });

        res.status(201).json({
            message: 'Ride booked successfully!',
            booking_id: newBooking._id,
            total_passengers_now: updatedRide.current_passengers,
            new_per_person_fare: perPersonFare
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create booking in database.' });
    }
};

module.exports = {
    bookRide
};
