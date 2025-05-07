// shared/utils/redis.js
const Redis = require('ioredis');

const redis = new Redis({
  host: 'redis', // Redis service name in docker-compose
  port: 6379
});

module.exports = redis;
