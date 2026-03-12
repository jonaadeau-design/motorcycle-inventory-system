const express = require('express');
const router = express.Router();
const Motorcycle = require('../models/Motorcycle');

// 1. ROUTE PARA MAG-ADD NG MOTOR (POST)
// Binago mula '/add' papuntang '/'
router.post('/', async (req, res) => {
    try {
        console.log("Data na natanggap:", req.body);
        const { brand, model, plateNumber } = req.body;
        
        const newMotor = new Motorcycle({ brand, model, plateNumber });
        await newMotor.save();
        
        res.status(201).json({ message: "Motor successfully added to Database!" });
    } catch (err) {
        console.error("Save Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// 2. ROUTE PARA MAKUHA ANG LAHAT NG MOTOR (GET)
// Binago mula '/all' papuntang '/'
router.get('/', async (req, res) => {
    try {
        const motors = await Motorcycle.find();
        res.json(motors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;