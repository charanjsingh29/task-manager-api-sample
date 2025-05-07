const { Op } = require('sequelize');
const { roleSchema, rolesCollection } = require('../response_schemas/role.schema');
const { Role, Permission, User } = require('../database/models');
const publisher = require('../shared/publisher');
const logger = require('../shared/utils/logger');
// const cache = require('../libs/MemCache');

exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.create({ name, created_by: req.user.id });
    
    if (permissions && permissions.length > 0) {
      await role.setPermissions(permissions);
    }

    const roleResource = roleSchema(role);

    publisher.send(
      'role.created',
      {
        created_by: req.user.id,
      },
      roleResource 
    );
    
    res.status(201).json(roleResource);
  } catch (error) {
    logger.error('Create role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getRoles = async (req, res) => {
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

    const { count, rows: roles } = await Role.findAndCountAll({
      attributes: { exclude: ['created_by', 'createdAt', 'updatedAt'] },
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { name: { [Op.like]: `%${keyword}%` } },
            ],
          },
        ],
        is_hidden: {
          [Op.not]: '1'
        }
      },
      include: [ {
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email', 'phone']
      }],
    });

    const rolesJson = rolesCollection(roles);

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
      roles: rolesJson,
      pagination: pagination
    });
  } catch (error) {
    logger.error('Get roles error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id, {
      attributes: { exclude: ['created_by', 'createdAt', 'updatedAt'] },
      include: [{
        model: Permission,
        as: 'permissions',
        attributes: ['id', 'name'],
      }, {
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email', 'phone']
      }]  
    }) 
    if (!role) {
      return res.status(404).json({ message: 'Role not found' }); 
    }

    res.status(201).json(roleSchema(role));
  } 
  catch (error) {
    logger.error('Get role by ID error:', error);
    res.status(500).json({ message: 'Internal server error' }); 
  }
}

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.update({ name });
    if (permissions && permissions.length > 0) {
      await role.setPermissions(permissions);
    }
    cache.clear();

    const roleResource = roleSchema(role);

    publisher.send(
      'role.updated',
      {
        created_by: req.user.id,
      },
      roleResource 
    );

    res.status(201).json(roleResource);
  } catch (error) {
    logger.error('Update role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const roleResource = roleSchema(role);

    await role.destroy();
    cache.clear();

    publisher.send(
      'role.deleted',
      {
        created_by: req.user.id,
      },
      roleResource 
    );

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    logger.error('Delete role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
