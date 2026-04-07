const express = require('express');
const { getAllRoutes } = require('../controllers/routeController');

const router = express.Router();

// Define the route to get all locations/routes
// When a GET request is made to this router's base path, it fetches the routes
router.get('/', getAllRoutes);

module.exports = router;
