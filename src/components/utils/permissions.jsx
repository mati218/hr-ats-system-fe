export const hasPermission = (user, module, action) => {
  const permissions = user?.role?.permissions || [];

  const permission = permissions.find(
    (item) => item.module === module
  );

  return permission?.[action] === true;
};