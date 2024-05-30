const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Set up session middleware
app.use(session({
    secret: 'secret_key', // Secret key for session
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Change to true if using HTTPS
}));

app.set('view engine', 'ejs');

// Serve static files from 'public' and 'admin' directories
app.use(express.static('public'));
app.use('/admin', express.static('admin'));


require('./dbs/mongoDB');

// * Router
app.use('/', require('./router'))

module.exports = app;
