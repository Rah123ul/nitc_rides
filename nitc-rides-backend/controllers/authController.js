const User = require('../models/User');
const Driver = require('../models/Driver');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_nitc_key';

const registerStudent = async (req, res) => {
    const { name, phone_number, password } = req.body;

    if (!name || !phone_number || !password) {
        return res.status(400).json({ error: 'Please provide name, phone number, and password' });
    }

    try {
        const existingUser = await User.findOne({ phone_number });
        if (existingUser) {
            return res.status(400).json({ error: 'Phone number already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            phone_number,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: newUser._id, phone_number, role: 'student' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Student registered successfully',
            token: token,
            user: {
                id: newUser._id,
                name,
                phone_number
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

const loginStudent = async (req, res) => {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
        return res.status(400).json({ error: 'Please provide phone number and password' });
    }

    try {
        const user = await User.findOne({ phone_number });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user._id, phone_number: user.phone_number, role: 'student' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                phone_number: user.phone_number
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

const registerDriver = async (req, res) => {
    const { name, phone_number, password, vehicle_type, license_number } = req.body;

    if (!name || !phone_number || !password || !vehicle_type || !license_number) {
        return res.status(400).json({ error: 'Please provide all details: name, phone_number, password, vehicle_type, license_number' });
    }

    if (vehicle_type !== 'Auto Rickshaw' && vehicle_type !== 'Magic Minivan') {
        return res.status(400).json({ error: 'Invalid vehicle type. Must be "Auto Rickshaw" or "Magic Minivan"' });
    }

    try {
        const existingDriver = await Driver.findOne({
            $or: [{ phone_number }, { license_number }]
        });
        
        if (existingDriver) {
            return res.status(400).json({ error: 'Phone number or License number already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDriver = await Driver.create({
            name,
            phone_number,
            password: hashedPassword,
            vehicle_type,
            license_number,
            status: 'offline'
        });

        const token = jwt.sign(
            { id: newDriver._id, phone_number, role: 'driver' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Driver registered successfully',
            token: token,
            driver: {
                id: newDriver._id,
                name,
                phone_number,
                vehicle_type,
                license_number,
                status: 'offline'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

const loginDriver = async (req, res) => {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
        return res.status(400).json({ error: 'Please provide phone number and password' });
    }

    try {
        const driver = await Driver.findOne({ phone_number });
        
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        const isMatch = await bcrypt.compare(password, driver.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: driver._id, phone_number: driver.phone_number, role: 'driver' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
            driver: {
                id: driver._id,
                name: driver.name,
                phone_number: driver.phone_number,
                vehicle_type: driver.vehicle_type,
                license_number: driver.license_number,
                status: driver.status
            }
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
