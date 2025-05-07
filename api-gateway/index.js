const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('./middlewares/auth');
const rateLimit = require('./middlewares/rate_limiter');
const delayedResponse = require('./middlewares/delayed_response');

const app = express();
app.use(cors({ 
    origin: '*', 
    credentials: true 
}));
// app.use(express.json());

app.use(delayedResponse);
// Apply rate limiter to all requests
app.use(rateLimit);

// Auth middleware for protected routes
app.use('/api/users', authMiddleware);
app.use('/api/tasks', authMiddleware);

// Proxy setup
app.use('/api/auth', createProxyMiddleware({ 
    target: 'http://user-service:4001', 
    changeOrigin: true,
    pathRewrite: { '^': '/auth' },
    cookieDomainRewrite: '',
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    },
}));
app.use('/api/users', createProxyMiddleware({ 
    target: 'http://user-service:4001', 
    changeOrigin: true,
    pathRewrite: { '^': '/users' },
    cookieDomainRewrite: '',
}));
app.use('/api/tasks', createProxyMiddleware({ 
    target: 'http://task-service:4002', 
    changeOrigin: true,
    cookieDomainRewrite: '',
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(8080, () => console.log('API Gateway running on port 8080'));
