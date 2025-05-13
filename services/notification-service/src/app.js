const express = require('express');

// Import middleware
const errorHandler = require('./shared/middlewares/error_handler');
const userContextMiddleware = require('./shared/middlewares/user_context');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/notifications/health', (req, res) => res.json({ status: 'ok' }));
app.use('/notifications', userContextMiddleware, require('./routes/notification.routes'));


// Error handling
app.use(errorHandler);

module.exports = app;