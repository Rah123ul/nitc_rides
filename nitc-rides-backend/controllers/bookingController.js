const db = require('../db/database');

const bookRide = (req, res) => {
    // 1. Security Check: Guarantee only students can book (preventing drivers from booking)
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Access denied. Only students can book rides.' });
    }

    const { ride_id, pickup_location, dropoff_location } = req.body;
    const student_id = req.user.id;

    if (!ride_id || !pickup_location || !dropoff_location) {
        return res.status(400).json({ error: 'Please provide ride_id, pickup_location, and dropoff_location.' });
    }

    // 2. Fetch the ride AND its original base fare from the routes table simultaneously
    const rideQuery = `
        SELECT r.*, rt.base_fare 
        FROM rides r
        JOIN routes rt ON r.route_id = rt.id
        WHERE r.id = ?
    `;

    db.get(rideQuery, [ride_id], (err, ride) => {
        if (err || !ride) {
            return res.status(404).json({ error: 'Ride not found.' });
        }

        if (ride.status !== 'active') {
            return res.status(400).json({ error: 'Sorry, this ride is no longer active.' });
        }

        if (ride.current_passengers >= ride.max_seats) {
            return res.status(400).json({ error: 'Sorry, this vehicle is completely full!' });
        }

        // 3. We have an open seat! Increase passenger count by 1.
        const newPassengersCount = ride.current_passengers + 1;

        // 4. Apply The Dynamic Shared Pricing Formula 
        // Formula: Driver total = base fare + (passengers - 1) × 10
        const driverTotal = ride.base_fare + ((newPassengersCount - 1) * 10);
        
        // Formula: Per person = driver total divided by passengers
        const rawPerPersonFare = driverTotal / newPassengersCount;
        
        // Let's round it cleanly to 2 decimal places so we don't have infinite repeating numbers
        const perPersonFare = Number(rawPerPersonFare.toFixed(2));

        // 5. Execute Database Updates in a sequence
        db.serialize(() => {
            // A. Update the ride's total passenger count
            db.run('UPDATE rides SET current_passengers = ? WHERE id = ?', [newPassengersCount, ride_id]);

            // B. UPDATE EVERYONE'S FARE: Force all existing bookings for this ride to the new, lowered fare
            db.run('UPDATE bookings SET per_person_fare = ? WHERE ride_id = ?', [perPersonFare, ride_id]);

            // C. Insert the new student's booking
            const insertBookingQuery = `
                INSERT INTO bookings (user_id, ride_id, pickup_location, dropoff_location, per_person_fare, status) 
                VALUES (?, ?, ?, ?, ?, 'confirmed')
            `;
            
            db.run(insertBookingQuery, [student_id, ride_id, pickup_location, dropoff_location, perPersonFare], function(insertErr) {
                if (insertErr) {
                    return res.status(500).json({ error: 'Failed to create booking in database.' });
                }

                // Return final confirmation to the frontend, keeping formula calculations totally hidden!
                res.status(201).json({
                    message: 'Ride booked successfully!',
                    booking_id: this.lastID,
                    total_passengers_now: newPassengersCount,
                    new_per_person_fare: perPersonFare
                });
            });
        });
    });
};

module.exports = {
    bookRide
};
