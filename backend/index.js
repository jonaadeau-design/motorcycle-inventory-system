require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');

const app = express();

// 1. SESSION SETTINGS
app.use(session({
    secret: 'secret-key-ng-motorcycle-system',
    resave: false,
    saveUninitialized: true
}));

// 2. MIDDLEWARES & STATIC FILES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJS settings para sa Login page lang
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ituro ang backend sa "build" folder ng React
app.use(express.static(path.join(__dirname, '../frontend/build')));

const Motorcycle = require('./models/Motorcycle');

// 3. LOGIN PROTECTION
const isAdmin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
};

// 4. ROUTES

// WELCOME ROUTE (Para hindi na "Not Found" ang main link)
app.get('/', (req, res) => {
    res.send('<h1>Motorcycle Inventory API is Running!</h1><p>Punta ka sa <a href="/login">/login</a> para mag-login.</p>');
});

// LOGIN PAGE
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// LOGIN ACTION
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        req.session.isLoggedIn = true;
        res.redirect('/inventory'); 
    } else {
        res.render('login', { error: 'Maling Username o Password!' });
    }
});

// LOGOUT
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// --- REACT INTEGRATION ---
app.get('/inventory', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// API ROUTES PARA SA REACT
app.get('/api/motorcycles', async (req, res) => {
    try {
        const motors = await Motorcycle.find().sort({ createdAt: -1 });
        res.json(motors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/inventory/add', async (req, res) => {
    try {
        const { brand, model, plateNumber } = req.body;
        const newMotor = new Motorcycle({ brand, model, plateNumber });
        await newMotor.save();
        res.status(201).json(newMotor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/motorcycles/:id', isAdmin, async (req, res) => {
    try {
        await Motorcycle.findByIdAndDelete(req.params.id);
        res.json({ message: "Motorcycle deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting motor." });
    }
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('************************************');
    console.log('   CONNECTED NA SA MONGODB!         ');
    console.log('************************************');
})
.catch(err => console.log('DB ERROR:', err.message));

// DITO ANG PAGBABAGO: Gamitin ang Port ni Render o 5000 kung local
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));