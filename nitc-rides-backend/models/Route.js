const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    start_location: { type: String, required: true },
    end_location: { type: String, required: true },
    base_fare: { type: Number, required: true },
});

module.exports = mongoose.model('Route', routeSchema);
