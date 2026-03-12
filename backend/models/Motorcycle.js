const mongoose = require('mongoose');

const MotorcycleSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    plateNumber: {
        type: String,
        required: true,
        unique: true // Para hindi magkapareho ang plate number sa database
    }
}, { timestamps: true });

module.exports = mongoose.model('Motorcycle', MotorcycleSchema);