var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var termekRouter = require('./routes/termek');

const cors = require('cors'); 

var app = express();

// CORS beállítások
var corsOptions = {
    origin: "http://localhost:3000",  // frontend URL és port
};
app.use(cors(corsOptions));  // CORS engedélyezése a frontend URL számára

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const jwt = require('jsonwebtoken'); // JWT importálása

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Token lekérése a headerből
    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }
        req.userId = decoded.id; // User id elmentése a request objektumba
        next();
    });
}

// API végpontok
app.use('/protected', verifyToken); 

app.use('/',indexRouter)
app.get('/cars', async (req, res) => {
    const ids = req.query.ids ? req.query.ids.split(',') : []; 
   

    try {
        const cars = await require('./db/dboperations').getCarsByIds(ids); // Autók lekérdezése id alapján
        

        res.json({ cars });
    } catch (error) {
        console.error('Error fetching cars:', error); // Hiba logolása
        res.status(500).json({ message: error.message });
    }
});


app.post('/bookings', async (req, res) => {
    const { carId, userId, paymentMethod } = req.body; // userid és paymentMethod lekérése a requestből

    try {
        const result = await require('./db/dboperations').createBooking(carId, userId, paymentMethod);

        const userProfile = await require('./db/dboperations').getUserProfile(userId); 
        const carDetails = await require('./db/dboperations').getCarsByIds([carId]); // Autó adatainak lekérése
        const car = carDetails[0];

        await require('./utils/emailService').sendConfirmationEmail(userProfile.email, car.Rendszam, car, { Nev: car.Nev, Telefon: car.Telefon, Email: car.Email }); // Send confirmation email with car details and seller info

        res.status(201).json({ message: 'Sikeres foglalás!', bookingId: result.insertId, car });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

app.get('/reservations', verifyToken, async (req, res) => {
    try {
        const userId = req.userId; // userid lekérése a requestből
        const reservations = await require('./db/dboperations').getUserReservations(userId); // Foglalások lekérése
        res.json({ success: true, reservations });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.use('/users', usersRouter);  // Az API végpontokat a /users prefixszel regisztráljuk



app.use('/termek', termekRouter);  // A termékek végpontjait is az /termek prefixszel
app.use('/users', require('./api/favorites')); // Integráljuk a kedvencek API-t

module.exports = app;
