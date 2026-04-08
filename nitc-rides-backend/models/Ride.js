const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', default: null },
    max_seats: { type: Number, required: true },
    current_passengers: { type: Number, default: 0 },
    status: { type: String, default: 'active', enum: ['active', 'completed'] }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
