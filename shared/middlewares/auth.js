const jwt = require('jsonwebtoken');
const { getUserAndPermissions } = require('../database/daos/user.dao');
const requestContext  = require('../utils/requestContext');

module.exports = (checkPermission) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await getUserAndPermissions(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      if (user.status == 0) {
        return res.status(401).json({ message: 'User not active' });
      }
  
      if (checkPermission && (
        (Array.isArray(checkPermission) && !checkPermission.some(perm => user.permissions.includes(perm))) ||
        (!Array.isArray(checkPermission) && !user.permissions.includes(checkPermission))
      )) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      requestContext.set('user', user);
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};