require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Route = require('../models/Route');

const predefinedRoutes = [
    { start: 'Ambience Hostel',      end: 'Ladies Hostel',       fare: 40 },
    { start: 'Ambience Hostel',      end: 'Mega Boys Hostel',    fare: 35 },
    { start: 'Ambience Hostel',      end: 'MBA Hostel',          fare: 30 },
    { start: 'Ambience Hostel',      end: 'Chemical Engg Block', fare: 50 },
    { start: 'Ambience Hostel',      end: 'Architecture Block',  fare: 55 },
    { start: 'Ladies Hostel',        end: 'Mega Boys Hostel',    fare: 30 },
    { start: 'Ladies Hostel',        end: 'MBA Hostel',          fare: 35 },
    { start: 'Ladies Hostel',        end: 'Chemical Engg Block', fare: 50 },
    { start: 'Ladies Hostel',        end: 'Architecture Block',  fare: 45 },
    { start: 'Mega Boys Hostel',     end: 'MBA Hostel',          fare: 25 },
    { start: 'Mega Boys Hostel',     end: 'Chemical Engg Block', fare: 40 },
    { start: 'Mega Boys Hostel',     end: 'Architecture Block',  fare: 45 },
    { start: 'MBA Hostel',           end: 'Chemical Engg Block', fare: 35 },
    { start: 'MBA Hostel',           end: 'Architecture Block',  fare: 40 },
    { start: 'Chemical Engg Block',  end: 'Architecture Block',  fare: 30 },
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB. Starting route seeding...');

        // Clear existing routes to prevent duplicates (since integer ID was autoincrement in SQLite)
        await Route.deleteMany({});

        // We assign integer IDs (1 through 15) to maintain exact frontend backwards compatibility
        const routesToInsert = predefinedRoutes.map((route, index) => ({
            id: index + 1,
            start_location: route.start,
            end_location: route.end,
            base_fare: route.fare
        }));

        await Route.insertMany(routesToInsert);
        console.log('✅ Successfully seeded 15 campus routes into MongoDB.');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding DB:', error);
        process.exit(1);
    }
};

seedDB();
