const {
    getUserSkinID,
    addUserResult,
  } = require('./handler');
  
  const routes = [
    {
      method: 'POST',
      path: '/skin',
      handler: addUserResult,
    },
    {
        method: 'GET',
        path: '/skin/{id}',
        handler: getUserSkinID,
      },
  ];

  module.exports = routes;
  