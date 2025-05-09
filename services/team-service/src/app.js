const express = require('express');

// Import middleware
const errorHandler = require('./shared/middlewares/error_handler');
const userContextMiddleware = require('./shared/middlewares/user_context');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const internalAuth = require('./shared/middlewares/internal_auth');

app.use('/internal', internalAuth, require('./routes/internal.routes'));
app.get('/teams/health', (req, res) => res.json({ status: 'ok' }));
app.use('/teams', userContextMiddleware, require('./routes/team.routes'));


// Error handling
app.use(errorHandler);

module.exports = app;