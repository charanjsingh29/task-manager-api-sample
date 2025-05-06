const roleSchema = (role) => {
    return {
      id: role.id,
      name: role.name,
      is_default: role.is_default,
      permissions: role.permissions ? role.permissions.map((perm) => ({
        id: perm.id,
        name: perm.name,
      })) : [],
      creator: role.creator ? {
        id: role.creator.id,
        name: role.creator.name,
        email: role.creator.email,
        phone: role.creator.phone,
      } : null,
    };
  };
  
  const rolesCollection = (roles) => {
    return roles.map(roleSchema);
  };
  
  module.exports = { roleSchema, rolesCollection };
  