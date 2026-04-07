const express = require('express');
const { registerStudent, loginStudent, registerDriver, loginDriver } = require('../controllers/authController');

// 1. Create a new Express router object
const router = express.Router();

// 2. Define the route for student registration
// This will handle POST requests sent to this specific path
router.post('/register/student', registerStudent);

// 3. Define the route for student login
router.post('/login/student', loginStudent);

// 4. Define the route for driver registration
router.post('/register/driver', registerDriver);

// 5. Define the route for driver login
router.post('/login/driver', loginDriver);

// 3. Export the router so it can be imported in server.js
module.exports = router;
