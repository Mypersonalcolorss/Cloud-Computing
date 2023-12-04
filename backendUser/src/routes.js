const {
    getUserSkinID,
    addUserResult,
    getAllSkinsHandler
  } = require('./handler');
  
  const routes = [
    {
      method: 'POST',
      path: '/skin',
      handler: addUserResult,
    },
    {
        method: 'POST',
        path: '/skin',
        handler: getAllSkinsHandler,
      },
    {
        method: 'GET',
        path: '/skin/{id}',
        handler: getUserSkinID,
      },
  ];

  module.exports = routes;
  