const db = require('../db/database');

const startRide = (req, res) => {
    // 1. Security Check: The middleware already verified the token, 
    // now we strictly check if the token belongs to a driver.
    if (req.user.role !== 'driver') {
        return res.status(403).json({ error: 'Access denied. Only drivers can start a ride.' });
    }

    const { route_id } = req.body;
    const driver_id = req.user.id; // We get this safely from the verified token!

    if (!route_id) {
        return res.status(400).json({ error: 'Please provide a route_id to start the ride.' });
    }

    // 2. Fetch the driver's vehicle type so we know their seating capacity
    db.get('SELECT vehicle_type FROM drivers WHERE id = ?', [driver_id], (err, driver) => {
        if (err || !driver) {
            return res.status(500).json({ error: 'Error fetching driver details from database.' });
        }

        // Auto Rickshaw = 4 seats, Magic Minivan = 8 seats
        const max_seats = driver.vehicle_type === 'Auto Rickshaw' ? 4 : 8;

        // 3. Create the new ride in the database
        const insertRideQuery = `
            INSERT INTO rides (driver_id, route_id, max_seats, current_passengers, status) 
            VALUES (?, ?, ?, 0, 'active')
        `;
        
        db.run(insertRideQuery, [driver_id, route_id, max_seats], function(insertErr) {
            if (insertErr) {
                return res.status(500).json({ error: 'Failed to create the new ride in the database.' });
            }

            const newRideId = this.lastID; // The ID of the newly started ride

            // 4. Update the driver's own profile status from 'offline' to 'active'
            db.run('UPDATE drivers SET status = ? WHERE id = ?', ['active', driver_id], (updateErr) => {
                if (updateErr) {
                    console.error('Warning: Failed to update driver status', updateErr);
                }

                // 5. Send success response back to the frontend
                res.status(201).json({
                    message: 'Ride started successfully!',
                    ride: {
                        id: newRideId,
                        driver_id: driver_id,
                        route_id: route_id,
                        max_seats: max_seats,
                        current_passengers: 0,
                        status: 'active'
                    }
                });
            });
        });
    });
};

const getActiveRides = (req, res) => {
    // 1. The Database Magic: A "JOIN" query that squishes three tables together 
    // so we get real names instead of just confusing ID numbers.
    const query = `
        SELECT 
            r.id AS ride_id, 
            r.current_passengers, 
            r.max_seats,
            d.name AS driver_name, 
            d.vehicle_type,
            rt.start_location, 
            rt.end_location, 
            rt.base_fare
        FROM rides r
        JOIN drivers d ON r.driver_id = d.id
        JOIN routes rt ON r.route_id = rt.id
        WHERE r.status = 'active'
    `;

    db.all(query, [], (err, rides) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching active rides.' });
        }

        // 2. Format the response nicely for the React frontend, calculating seats left dynamically
        const formattedRides = rides.map(ride => ({
            ride_id: ride.ride_id,
            driver_name: ride.driver_name,
            vehicle_type: ride.vehicle_type,
            route: `${ride.start_location} to ${ride.end_location}`,
            base_fare: ride.base_fare,
            seats_left: ride.max_seats - ride.current_passengers
        }));

        res.status(200).json({
            message: 'Active rides fetched successfully!',
            count: formattedRides.length,
            rides: formattedRides
        });
    });
};

const completeRide = (req, res) => {
    // 1. Security Check
    if (req.user.role !== 'driver') {
        return res.status(403).json({ error: 'Access denied. Only drivers can end a ride.' });
    }

    const { ride_id } = req.body;
    const driver_id = req.user.id; // Pulled safely from JWT Token

    if (!ride_id) {
        return res.status(400).json({ error: 'Please provide a ride_id.' });
    }

    // 2. Strict Ownership Check: ensure this ride belongs to the driver making the request
    db.get('SELECT * FROM rides WHERE id = ? AND driver_id = ? AND status = ?', [ride_id, driver_id, 'active'], (err, ride) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while checking the ride.' });
        }
        if (!ride) {
            return res.status(404).json({ error: 'Active ride not found, or you do not have permission to end it.' });
        }

        // 3. Execution Phase
        db.serialize(() => {
            // End the ride
            db.run('UPDATE rides SET status = ? WHERE id = ?', ['completed', ride_id]);
            
            // Mark the driver as offline and available again
            db.run('UPDATE drivers SET status = ? WHERE id = ?', ['offline', driver_id], function(updateErr) {
                if (updateErr) {
                    return res.status(500).json({ error: 'Failed to finalize the trip.' });
                }

                res.status(200).json({
                    message: 'Trip completed successfully! You are now offline.',
                    ride_id: ride_id
                });
            });
        });
    });
};

const getMyStats = (req, res) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ error: 'Drivers only.' });
    }
    const driver_id = req.user.id;

    // Count completed trips today
    const statsQuery = `
        SELECT COUNT(*) AS trips_today
        FROM rides
        WHERE driver_id = ?
          AND status = 'completed'
          AND DATE(created_at) = DATE('now')
    `;
    db.get(statsQuery, [driver_id], (err, stats) => {
        if (err) return res.status(500).json({ error: 'DB error fetching stats.' });

        // Find active ride if any
        const activeQuery = `
            SELECT r.id, r.route_id, r.max_seats, r.current_passengers, r.status,
                   rt.start_location, rt.end_location, rt.base_fare
            FROM rides r
            JOIN routes rt ON r.route_id = rt.id
            WHERE r.driver_id = ? AND r.status = 'active'
            LIMIT 1
        `;
        db.get(activeQuery, [driver_id], (err2, activeRide) => {
            if (err2) return res.status(500).json({ error: 'DB error fetching active ride.' });
            res.status(200).json({
                trips_today: stats?.trips_today || 0,
                active_ride: activeRide || null
            });
        });
    });
};

module.exports = {
    startRide,
    getActiveRides,
    completeRide,
    getMyStats
};
