const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ride_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    pickup_location: { type: String, required: true },
    dropoff_location: { type: String, required: true },
    per_person_fare: { type: Number, required: true },
    status: { type: String, default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
