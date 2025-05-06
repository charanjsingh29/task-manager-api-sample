const requestContext = require('../utils/requestContext');

module.exports = (req, res, next) => {
  requestContext.run({ req }, () => {
    next();
  });
};