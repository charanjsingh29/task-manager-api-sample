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
app.get('/tasks/health', (req, res) => res.json({ status: 'ok' }));
app.use('/tasks', userContextMiddleware, require('./routes/task.routes'));


// Error handling
app.use(errorHandler);

module.exports = app;