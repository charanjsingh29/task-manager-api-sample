const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();

// Import middleware
const errorHandler = require('./shared/middlewares/errorHandler');
const delayedResponse = require('./shared/middlewares/delayedResponse');
const userContextMiddleware = require('./shared/middlewares/userContext');

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: '*',
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add user context middleware after authentication
app.use(userContextMiddleware);

app.use('/users', delayedResponse, require('./routes/user.routes'));
app.use('/roles', delayedResponse, require('./routes/role.routes'));

// Error handling
app.use(errorHandler);

module.exports = app;