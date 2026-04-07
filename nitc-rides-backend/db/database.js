const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database (this will create a file named nitcrides.db in the db folder if it doesn't exist)
const dbPath = path.resolve(__dirname, 'nitcrides.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    // 1. users: Stores the basic information of the students using the app, such as their names, phone numbers, and login credentials. It keeps track of who is requesting the rides.
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone_number TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 2. drivers: Stores details about the people driving the vehicles. It includes their names, vehicle type (Auto Rickshaw or Magic Minivan), license details, and their current working status.
    db.run(`
        CREATE TABLE IF NOT EXISTS drivers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone_number TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL DEFAULT '',
            vehicle_type TEXT CHECK(vehicle_type IN ('Auto Rickshaw', 'Magic Minivan')) NOT NULL,
            license_number TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'offline',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    // Migration: add password column to existing databases that were created without it
    db.run(`ALTER TABLE drivers ADD COLUMN password TEXT NOT NULL DEFAULT ''`, (err) => {
        if (err && !err.message.includes('duplicate column')) {
            // Not a duplicate column error — log it
            console.error('Migration error:', err.message);
        }
    });

    // 3. routes: Defines the valid paths from a starting location to a destination (from the 6 fixed locations), along with the fixed base fare assigned to that specific journey.
    db.run(`
        CREATE TABLE IF NOT EXISTS routes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            start_location TEXT NOT NULL,
            end_location TEXT NOT NULL,
            base_fare REAL NOT NULL,
            UNIQUE(start_location, end_location)
        )
    `);

    // 4. rides: Tracks the actual trips currently happening or completed by a driver. It tracks which route is being taken, which driver is operating the vehicle, the maximum seats, and current passengers onboard.
    db.run(`
        CREATE TABLE IF NOT EXISTS rides (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            driver_id INTEGER NOT NULL,
            route_id INTEGER NOT NULL,
            max_seats INTEGER NOT NULL,
            current_passengers INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (driver_id) REFERENCES drivers(id),
            FOREIGN KEY (route_id) REFERENCES routes(id)
        )
    `);

    // 5. bookings: Connects a student to a specific ride. It stores who booked it, which ride they joined, pickup/drop-off, booking status, and final per-person fare charged.
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            ride_id INTEGER NOT NULL,
            pickup_location TEXT NOT NULL,
            dropoff_location TEXT NOT NULL,
            per_person_fare REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (ride_id) REFERENCES rides(id)
        )
    `);

    console.log('Database tables verified/created successfully.');
});

module.exports = db;
