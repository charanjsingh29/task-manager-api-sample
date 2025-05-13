const jwt = require('jsonwebtoken');
const { userSchema } = require('../response_schemas/user.schema');
const { 
  User, 
  Role 
} = require('../database/models');
const { 
  getPermissionsByRoles, 
  getUserAndPermissions 
} = require('../database/daos/user.dao');
const logger = require('../shared/utils/logger');

function generateAccessToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
}

function generateRefreshToken(user) {
  return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
  );
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; 
    
    const user = await User.findOne({ 
      where: { email },
      include: {
        model: Role,
        as: 'roles',
        attributes: ['id','name'],
      }
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.permissions = await getPermissionsByRoles(user.roles);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set HTTP-only cookie with refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      token: accessToken,
      user: userSchema(user),
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return res.json({ message: 'Logged out successfully' });
}

exports.refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET,);
    const user = await getUserAndPermissions(decoded.id);
    if (!user) {
      return res.status(403).json({ message: 'Refresh token not valid' });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({
      token: newAccessToken,
      user: userSchema(user),
    });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userRole = await Role.findOne({ where: { name: 'User' } });
    if (!userRole) {
      return res.status(500).json({ message: 'User role not found' });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      phone
    });
    await user.setRoles([userRole.id]);

    const userRes = userSchema(user);

    res.status(201).json(userRes);
  } catch (error) {
    logger.error('Register user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}