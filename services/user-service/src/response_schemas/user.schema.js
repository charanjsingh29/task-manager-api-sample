// const userRoleTransformer = require('./userRoleTransformer');

const statusSchema = (status) => {
  let label = 'Unknown';
  let color = '#808080';
  switch (status) {
    case 1:
      label = 'Active';
      color = '#008000';
      break;
    case 0:
      label = 'Inactive';
      color = '#FF0000';
      break;
    case 2:
      label = 'Blocked';
      color = '#FF0000';
      break;
  }
  return {
    id: status,
    label: label,
    color: color
  };
};

const userSchema = (user) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status != undefined ? statusSchema(user.status): undefined,
      last_login: user.last_login,
      // roles: user.roles ? userRoleTransformer.rolesCollection(user.roles) : undefined,
      permissions: user.permissions ?? [],
    };
  };
  
  const userCollection = (users) => {
    return users.map(userSchema);
  };
  
  module.exports = { userSchema, userCollection };
  