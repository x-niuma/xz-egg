'use strict';

// 应用配置
module.exports = appInfo => {
  // Init Config
  const config = {};

  config.cluster = {
    listen: {
      path: '',
      port: 8003,
      hostname: '0.0.0.0',
    },
  };

  return config;
};
