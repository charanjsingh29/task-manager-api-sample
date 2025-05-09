const axios = require('axios');

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'x-internal-token': process.env.INTERNAL_SECRET_TOKEN
  }
});

module.exports = axiosInstance;