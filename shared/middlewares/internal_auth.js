module.exports = function internalAuth(req, res, next) {
    const internalToken = req.headers['x-internal-token'];
  
    if (internalToken !== process.env.INTERNAL_SECRET_TOKEN) {
      return res.status(403).json({ message: 'Forbidden: Unauthorized internal request' });
    }
  
    next();
  };
  