const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
  const RESPONSE_DELAY = process.env.RESPONSE_DELAY;
  const NODE_ENV = process.env.NODE_ENV;
  const delay = parseInt(RESPONSE_DELAY) || 0;
  if (NODE_ENV == 'development' && delay > 0) {
    console.log(`Delaying response for ${delay}ms`)
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve();
          next();
      }, delay);
    });
  } else {
    next();
  }
};