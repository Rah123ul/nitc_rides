const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const Route = require('../models/Route');

const startRide = async (req, res) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ error: 'Access denied. Only drivers can start a ride.' });
    }

    const { route_id } = req.body;
    const driver_id = req.user.id;

    if (!route_id) {
        return res.status(400).json({ error: 'Please provide a route_id to start the ride.' });
    }

    try {
        const driver = await Driver.findById(driver_id);
        if (!driver) {
            return res.status(500).json({ error: 'Error fetching driver details from database.' });
        }

        const max_seats = driver.vehicle_type === 'Auto Rickshaw' ? 4 : 8;

        // Note: route_id from frontend might be testing integer ID. We need the objectId, or we store the integer ID in the Route Model and find by integers.
        // Wait, route_id coming from frontend is `r.id` which is the integer ID because they were fetching it from `getAllRoutes`.
        // Let's find the MongoDB Route document by the integer `id` field.
        const route = await Route.findOne({ id: route_id });
        if (!route) {
            return res.status(404).json({ error: 'Route not found.' });
        }

        const newRide = await Ride.create({
            driver_id: driver._id,
            route_id: route._id,
            max_seats,
            current_passengers: 0,
            status: 'active'
        });

        await Driver.findByIdAndUpdate(driver_id, { status: 'active' });

        res.status(201).json({
            message: 'Ride started successfully!',
            ride: {
                id: newRide._id, // Return the string _id mapped to id for frontend compatibility
                driver_id: driver_id,
                route_id: route_id, // keep it the integer id for frontend consistency
                max_seats: max_seats,
                current_passengers: 0,
                status: 'active'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create the new ride in the database.' });
    }
};

const getActiveRides = async (req, res) => {
    try {
        const rides = await Ride.find({ status: 'active' })
            .populate('driver_id', 'name vehicle_type')
            .populate('route_id', 'start_location end_location base_fare');

        const formattedRides = rides.map(ride => ({
            ride_id: ride._id,
            driver_name: ride.driver_id.name,
            vehicle_type: ride.driver_id.vehicle_type,
            route: `${ride.route_id.start_location} to ${ride.route_id.end_location}`,
            base_fare: ride.route_id.base_fare,
            seats_left: ride.max_seats - ride.current_passengers
        }));

        res.status(200).json({
            message: 'Active rides fetched successfully!',
            count: formattedRides.length,
            rides: formattedRides
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error while fetching active rides.' });
    }
};

const completeRide = async (req, res) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ error: 'Access denied. Only drivers can end a ride.' });
    }

    const { ride_id } = req.body;
    const driver_id = req.user.id;

    if (!ride_id) {
        return res.status(400).json({ error: 'Please provide a ride_id.' });
    }

    try {
        const ride = await Ride.findOne({ _id: ride_id, driver_id, status: 'active' });
        if (!ride) {
            return res.status(404).json({ error: 'Active ride not found, or you do not have permission to end it.' });
        }

        ride.status = 'completed';
        await ride.save();

        await Driver.findByIdAndUpdate(driver_id, { status: 'offline' });

        res.status(200).json({
            message: 'Trip completed successfully! You are now offline.',
            ride_id: ride_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to finalize the trip.' });
    }
};

const getMyStats = async (req, res) => {
    if (req.user.role !== 'driver') {
        return res.status(403).json({ error: 'Drivers only.' });
    }
    const driver_id = req.user.id;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tripsToday = await Ride.countDocuments({
            driver_id,
            status: 'completed',
            createdAt: { $gte: today }
        });

        const activeRide = await Ride.findOne({ driver_id, status: 'active' })
            .populate('route_id');

        let formattedActiveRide = null;
        if (activeRide && activeRide.route_id) {
            formattedActiveRide = {
                id: activeRide._id,
                route_id: activeRide.route_id.id,
                max_seats: activeRide.max_seats,
                current_passengers: activeRide.current_passengers,
                status: activeRide.status,
                start_location: activeRide.route_id.start_location,
                end_location: activeRide.route_id.end_location,
                base_fare: activeRide.route_id.base_fare
            };
        }

        res.status(200).json({
            trips_today: tripsToday,
            active_ride: formattedActiveRide
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'DB error fetching stats.' });
    }
};

module.exports = {
    startRide,
    getActiveRides,
    completeRide,
    getMyStats
};
