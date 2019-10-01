'use strict';

// 应用配置
module.exports = appInfo => {

  // Init Config
  const config = {};

  config.cluster = {
    listen: {
      path: '',
      port: 8005,
      hostname: '0.0.0.0',
    },
  };

  // Use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1546955132863_7432';

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // Mysql Config
  config.mysql = {
    client: {
      host: '39.108.138.156',
      port: '3306',
      user: 'root',
      password: 'gaoxiong123.',
      database: 'xz',
    },
    app: true,
    agent: false,
  };

  // Redis Config
  config.redis = {
    client: {
      host: '39.108.138.156',
      port: '6379',
      user: 'root',
      password: 'gaoxiong123',
      db: 0,
    },
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // Add your config here
  config.middleware = [ 'errorHandler' ];

  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: ['connection'],
        packetMiddleware: []
      }
    }
  };

  return config;
};
