// shared/middleware/userContext.js
const axios = require('axios');
const redis = require('../utils/redis');

module.exports = async function userContext(req, res, next) {
  try {
    const userId = req.headers['x-user-id'];
    const token = req.headers['authorization']?.split(' ')[1];

    if (!userId || !token) return res.status(401).json({ message: 'Unauthorized' });

    const cacheKey = `user:${userId}`;
    let user = await redis.get(cacheKey);

    if (user) {
      req.user = JSON.parse(user);
      return next();
    }

    const response = await axios.get(
      `http://user-service:3000/internal/users/${userId}`,
      {
        headers: {
          'x-internal-token': process.env.INTERNAL_SECRET_TOKEN
        }
      }
    );

    user = response.data;
    await redis.set(cacheKey, JSON.stringify(user), 'EX', 60 * 5); // cache for 5 mins

    req.user = user;
    next();
  } catch (err) {
    console.error('userContext error:', err.message);
    return res.status(401).json({ message: 'Invalid or unauthorized user' });
  }
};
