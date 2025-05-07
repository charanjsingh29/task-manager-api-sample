const express = require('express');
const cookieParser = require("cookie-parser");

// Import middleware
const errorHandler = require('./shared/middlewares/error_handler');
const userContextMiddleware = require('./shared/middlewares/user_context');

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add user context middleware after authentication
// app.use(userContextMiddleware);

const internalAuth = require('./shared/middlewares/internal_auth');

app.use('/internal', internalAuth, require('./routes/internal.routes'));
app.use('/auth', require('./routes/auth.routes'));
// app.use('/roles', userContextMiddleware, require('./routes/role.routes'));


app.get('/health', (req, res) => res.json({ status: 'ok' }));
// Error handling
app.use(errorHandler);

module.exports = app;