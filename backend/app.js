var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var termekRouter = require('./routes/termek');

const cors = require('cors'); // Cross-Origin Resource Sharing

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

const jwt = require('jsonwebtoken'); // Import JWT library

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from headers
    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Unauthorized.' });
        }
        req.userId = decoded.id; // Save user ID for use in other routes
        next();
    });
}

// API végpontok
app.use('/protected', verifyToken); // Apply JWT verification middleware to protected routes

app.use('/',indexRouter)
app.get('/cars', async (req, res) => {
    const ids = req.query.ids ? req.query.ids.split(',') : []; // Get the IDs from the query string, ensure it's defined
   

    try {
        const cars = await require('./db/dboperations').getCarsByIds(ids); // Fetch cars by IDs
        

        res.json({ cars });
    } catch (error) {
        console.error('Error fetching cars:', error); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
});


app.post('/bookings', async (req, res) => {
    const { carId, userId, paymentMethod } = req.body; // Assuming userId and paymentMethod are passed in the request body

    try {
        const result = await require('./db/dboperations').createBooking(carId, userId, paymentMethod);

        console.log('Booking created with ID:', result.insertId); // Log the booking ID
        const userProfile = await require('./db/dboperations').getUserProfile(userId); // Retrieve user profile
        const carDetails = await require('./db/dboperations').getCarsByIds([carId]); // Fetch car details
        const car = carDetails[0]; // Assuming we get the first car details


        await require('./utils/emailService').sendConfirmationEmail(userProfile.email, car.Rendszam, car.Tipus, car.Modell, car.Evjarat); // Send confirmation email with car details




        res.status(201).json({ message: 'Sikeres foglalás!', bookingId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

app.use('/users', usersRouter);  // Az API végpontokat a /users prefixszel regisztráljuk


app.use('/termek', termekRouter);  // A termékek végpontjait is az /termek prefixszel
app.use('/users', require('./api/favorites')); // Integrate favorites routes

module.exports = app;
