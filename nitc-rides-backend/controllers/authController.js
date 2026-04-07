const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for JWT (In production, load this securely from a .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_nitc_key';

const registerStudent = async (req, res) => {
    const { name, phone_number, password } = req.body;

    // 1. Basic Validation: Ensure all fields are provided
    if (!name || !phone_number || !password) {
        return res.status(400).json({ error: 'Please provide name, phone number, and password' });
    }

    try {
        // 2. Check if a user with this phone number already exists
        db.get('SELECT id FROM users WHERE phone_number = ?', [phone_number], async (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error while checking user' });
            }
            if (row) {
                return res.status(400).json({ error: 'Phone number already registered' });
            }

            // 3. Hash the password before saving (NEVER save plain text)
            // The '10' is the salt rounds, which determines the complexity/security of the hash
            const hashedPassword = await bcrypt.hash(password, 10);

            // 4. Insert the new student into the database
            const insertQuery = 'INSERT INTO users (name, phone_number, password) VALUES (?, ?, ?)';
            
            db.run(insertQuery, [name, phone_number, hashedPassword], function(insertErr) {
                if (insertErr) {
                    return res.status(500).json({ error: 'Failed to register student' });
                }

                // 'this.lastID' gives us the ID of the newly created database record
                const newUserId = this.lastID;

                // 5. Generate the JWT Token confirming their identity
                const token = jwt.sign(
                    { id: newUserId, phone_number: phone_number, role: 'student' },
                    JWT_SECRET,
                    { expiresIn: '24h' } // The token expires in 24 hours
                );

                // 6. Return success response (omitting the password!)
                res.status(201).json({
                    message: 'Student registered successfully',
                    token: token,
                    user: {
                        id: newUserId,
                        name: name,
                        phone_number: phone_number
                    }
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

const loginStudent = async (req, res) => {
    const { phone_number, password } = req.body;

    // 1. Basic Validation: Ensure both fields are provided
    if (!phone_number || !password) {
        return res.status(400).json({ error: 'Please provide phone number and password' });
    }

    try {
        // 2. Find the user by phone number
        db.get('SELECT * FROM users WHERE phone_number = ?', [phone_number], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error during login' });
            }
            // If no user is returned, the phone number isn't registered
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // 3. Compare the provided password with the hashed password in the database
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            // 4. Passwords match perfectly! Generate a new JWT Token
            const token = jwt.sign(
                { id: user.id, phone_number: user.phone_number, role: 'student' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // 5. Return success response (never return the password)
            res.status(200).json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    phone_number: user.phone_number
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

const registerDriver = async (req, res) => {
    const { name, phone_number, password, vehicle_type, license_number } = req.body;

    // 1. Basic Validation: Ensure all fields are provided
    if (!name || !phone_number || !password || !vehicle_type || !license_number) {
        return res.status(400).json({ error: 'Please provide all details: name, phone_number, password, vehicle_type, license_number' });
    }

    // 1b. Strict vehicle type check
    if (vehicle_type !== 'Auto Rickshaw' && vehicle_type !== 'Magic Minivan') {
        return res.status(400).json({ error: 'Invalid vehicle type. Must be "Auto Rickshaw" or "Magic Minivan"' });
    }

    try {
        // 2. Check if a driver with this phone number or license number already exists
        db.get('SELECT id FROM drivers WHERE phone_number = ? OR license_number = ?', [phone_number, license_number], async (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error while checking driver' });
            }
            if (row) {
                return res.status(400).json({ error: 'Phone number or License number already registered' });
            }

            // 3. Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10);

            // 4. Insert the new driver into the database (status will default to 'offline')
            const insertQuery = 'INSERT INTO drivers (name, phone_number, password, vehicle_type, license_number) VALUES (?, ?, ?, ?, ?)';
            
            db.run(insertQuery, [name, phone_number, hashedPassword, vehicle_type, license_number], function(insertErr) {
                if (insertErr) {
                    return res.status(500).json({ error: 'Failed to register driver' });
                }

                const newDriverId = this.lastID;

                // 5. Generate the JWT Token with a 'driver' role
                const token = jwt.sign(
                    { id: newDriverId, phone_number: phone_number, role: 'driver' },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                // 6. Return success response
                res.status(201).json({
                    message: 'Driver registered successfully',
                    token: token,
                    driver: {
                        id: newDriverId,
                        name: name,
                        phone_number: phone_number,
                        vehicle_type: vehicle_type,
                        license_number: license_number,
                        status: 'offline'
                    }
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

const loginDriver = async (req, res) => {
    const { phone_number, password } = req.body;

    // 1. Basic Validation
    if (!phone_number || !password) {
        return res.status(400).json({ error: 'Please provide phone number and password' });
    }

    try {
        // 2. Find the driver by phone number
        db.get('SELECT * FROM drivers WHERE phone_number = ?', [phone_number], async (err, driver) => {
            if (err) {
                return res.status(500).json({ error: 'Database error during login' });
            }
            if (!driver) {
                return res.status(404).json({ error: 'Driver not found' });
            }

            // 3. Compare passwords
            const isMatch = await bcrypt.compare(password, driver.password);
            
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            // 4. Generate a JWT Token with 'driver' role
            const token = jwt.sign(
                { id: driver.id, phone_number: driver.phone_number, role: 'driver' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // 5. Return success response
            res.status(200).json({
                message: 'Login successful',
                token: token,
                driver: {
                    id: driver.id,
                    name: driver.name,
                    phone_number: driver.phone_number,
                    vehicle_type: driver.vehicle_type,
                    license_number: driver.license_number,
                    status: driver.status
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

module.exports = {
    registerStudent,
    loginStudent,
    registerDriver,
    loginDriver
};
