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

// API végpontok
app.use('/',indexRouter)
app.use('/users', usersRouter);  // Az API végpontokat a /users prefixszel regisztráljuk
app.use('/termek', termekRouter);  // A termékek végpontjait is az /termek prefixszel
module.exports = app;
