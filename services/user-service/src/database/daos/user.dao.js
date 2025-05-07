const { User, Role, Permission } = require('../models');
// const cache = require('../../libs/MemCache');

const getUserAndPermissions = async (userId) => {
    /* const cacheKey = `user_cache_${userId}`;
    const cachedUser = cache.get(cacheKey);
    if (cachedUser) {
        console.log('userDao Cache hit');
        return cachedUser;
    }
    console.log('userDao Cache miss'); */
    
    const userRow = await User.findByPk(userId, {
        include: {
            model: Role,
            as: 'roles',
            attributes: ['id', 'name'],
        }
    });
    if (!userRow) {
        return userRow;
    }
    
    const userPermissions = await getPermissionsByRoles(userRow.roles);
    
    const user = {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        phone: userRow.phone,
        status: userRow.status,
        permissions: userPermissions,
    };
    cache.set(cacheKey, user, 30);
    return user;
}

const getPermissionsByRoles = async (roles) => {
    const hasSuperAdminRole = roles.some(role => role.name === 'Super-admin');
    let permissions = [];
    if(hasSuperAdminRole){
        permissions = await Permission.findAll({
            attributes: ['permission']
        });
    }
    else{
        permissions = await Permission.findAll({
            include: [{
                model: Role,
                as: 'roles',
                where: {
                    id: roles.map(role => role.id)
                }
            }],
            attributes: ['permission']
        });
    }

    const userPermissions = permissions.map(permission => {
        if(hasSuperAdminRole && permission.permission.includes('own')){
            return null;
        }
        return permission.permission;
      }).filter(Boolean);

    return userPermissions;
}

module.exports = {
    getUserAndPermissions,
    getPermissionsByRoles
}