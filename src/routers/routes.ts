export const endpoints = Object.freeze({
  user: {
    me: '/user/me',
    create: '/user/create',
    update: '/user/update',
    delete: '/user/delete',
    update_password: '/user/update-password',
  },
  auth: {
    login: '/login',
    logout: '/logout',
  },
});

export const routes = Object.freeze({
  user: '/user',
  auth: '/auth',
});
