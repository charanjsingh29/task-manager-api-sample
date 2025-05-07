const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { userSchema, userCollection } = require('../response_schemas/user.schema');
const { User, Role } = require('../database/models');
const { getUserAndPermissions } = require('../database/daos/user.dao');
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

    const { count, rows: users } = await User.findAndCountAll({
      attributes: ['id', 'name', 'email', 'phone', 'status'],
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } }
        ]
      },
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
      /* where: {
        id: {
          [Op.notIn]: sequelize.literal(
            '(SELECT user_id FROM user_has_roles WHERE role_id = (SELECT id FROM roles WHERE name = "Super-admin"))'
          )
        }
      }, */
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