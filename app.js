'use strict';

const express = require('express');
const port = process.env.PORT || 3000;
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const {xhrErrorHandler, notFoundErrorHandler, finalErrorHandler} = require('./middlewares/customErrorHandlers');

require('dotenv').config();
require('./config/passport_setup')(passport);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(flash());

app.use(logger('dev'));

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// set static file path
app.use(express.static(path.join(__dirname, '/public')));

// connect to DB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit(1);
});

app.use(session({ 
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_NAME,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 1 day.
  },
  resave: true, 
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// to app routes
const appRouter = require('./routes/app');
app.use('/', appRouter);

//handle all errors:from next(error) at the end
app.use(xhrErrorHandler);
app.use(notFoundErrorHandler);
app.use(finalErrorHandler);

app.listen(port, () => {
  console.log('Node Server is listening on port: ' + port);
  if (process.env.NODE_ENV !== 'production') {
      console.log('We are in development mode');
  }
});