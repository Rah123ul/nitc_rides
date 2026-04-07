const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    vehicle_type: { type: String, required: true, enum: ['Auto Rickshaw', 'Magic Minivan'] },
    license_number: { type: String, required: true, unique: true },
    status: { type: String, default: 'offline', enum: ['offline', 'active'] }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
