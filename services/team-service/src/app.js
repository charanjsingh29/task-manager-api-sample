const express = require('express');

// Import middleware
const errorHandler = require('./shared/middlewares/error_handler');
const userContextMiddleware = require('./shared/middlewares/user_context');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add user context middleware after authentication
// app.use(userContextMiddleware);

const internalAuth = require('./shared/middlewares/internal_auth');

app.use('/internal', internalAuth, require('./routes/internal.routes'));
app.use('/teams', userContextMiddleware, require('./routes/team.routes'));


app.get('/health', (req, res) => res.json({ status: 'ok' }));
// Error handling
app.use(errorHandler);

module.exports = app;