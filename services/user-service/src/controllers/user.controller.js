const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { userSchema, userCollection } = require('../response_schemas/user.schema');
const { User, Role } = require('../database/models');
const { getUserAndPermissions, getPermissionsByRoles } = require('../database/daos/user.dao');
const logger = require('../shared/utils/logger');
const publisher = require('../shared/publisher');

exports.getUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder || 'desc';
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let offset = (page - 1) * limit;
    if(page === -1){
      limit = undefined;
      offset = undefined;
    }

    let where = {
      [Op.or]: [
        { name: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
        { phone: { [Op.like]: `%${keyword}%` } }
      ]
    };

    if(req.body){
      const { user_ids } = req.body;
      if(user_ids.length > 0){
        where.id = {
          [Op.in]: user_ids
        };
      }
    }

    const { count, rows: users } = await User.findAndCountAll({
      attributes: ['id', 'name', 'email', 'phone', 'status'],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      where,
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['id', 'name'],
        through: { 
          attributes: [] 
        },
        where: {
          is_hidden: {
            [Op.not]: '1'
          }
        },
      }],
    });

    const userJson = userCollection(users);

    let pagination = {};
    if(page > 0){
      pagination = {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        perPage: limit
      };
    }
    
    res.json({
      users: userJson,
      pagination: pagination
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await getUserAndPermissions(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } 

    const userRes = userSchema(user);

    res.json(userRes);
  }  catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }]
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } 
    user.permissions = await getPermissionsByRoles(user.roles);
    res.json(userSchema(user));
  }  catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });
    res.json({ message: 'Password changed successfully' });
  }
  catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUsersByEmail = async (req, res) => {
  try {
    let where = {
      status: '1'
    };

    let emails = [];
    if(req.body){
      const { emails: emailsFromBody } = req.body;
      if(emailsFromBody.length > 0){
        emails = emailsFromBody;
        where.email = {
          [Op.in]: emails  // Changed from id to email for exact match
        };
      }
    }

    const users  = await User.findAll({
      attributes: ['id', 'name', 'email'],
      where,
      include: [{
        model: Role,
        as: 'roles',
        attributes: [],
        through: { 
          attributes: [] 
        },
        where: {
          is_hidden: {
            [Op.not]: '1'
          }
        },
      }],
    });

    if(users.length < emails.length){
      const emailsNotRegistered = emails.filter(email => !users.some(user => user.email === email));

      return res.status(400).json({
        not_allowed: emailsNotRegistered
      });
    }

    const userJson = users.map(user => {
      return {id: user.id, name: user.name, email: user.email}
    });
    
    res.json({
      users: userJson,
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};