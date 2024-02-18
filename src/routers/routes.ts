export const routes = Object.freeze({
  user: '/user',
  auth: '/auth',
  ping: '/ping',
});

export const endpoints = Object.freeze({
  user: {
    me: '/me',
    create: '/create',
    update: '/update',
    delete: '/delete',
    update_password: '/update-password',
  },
  auth: {
    login: '/login',
    logout: '/logout',
  },
  ping: '/ping',
});
