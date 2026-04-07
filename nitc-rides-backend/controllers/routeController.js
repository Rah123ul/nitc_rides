const db = require('../db/database');

const getAllRoutes = (req, res) => {
    // db.all runs the query and returns all matching rows as an array
    db.all('SELECT * FROM routes', [], (err, routes) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error while fetching routes' });
        }
        
        // If successful, send the routes back to whoever requested them
        res.status(200).json({
            message: 'Routes fetched successfully',
            count: routes.length,
            routes: routes
        });
    });
};

module.exports = {
    getAllRoutes
};
