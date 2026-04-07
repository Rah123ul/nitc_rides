const Route = require('../models/Route');

const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find();
        
        // Map _id to id so frontend doesn't break if it expects `id`
        const mappedRoutes = routes.map(r => ({
            id: r.id,     // The integer ID we preserved
            _id: r._id,   // The MongoDB ID
            start_location: r.start_location,
            end_location: r.end_location,
            base_fare: r.base_fare
        }));

        res.status(200).json({
            message: 'Routes fetched successfully',
            count: mappedRoutes.length,
            routes: mappedRoutes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error while fetching routes' });
    }
};

module.exports = {
    getAllRoutes
};
