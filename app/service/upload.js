'use strict';

const Service = require('egg').Service;
const qiniu = require('qiniu');

const bucket = 'blog';
const AccessKey = 'Xu-zACyarx7mv9HMRmUOOM20BllQtYMe-XWJek27';
const SecretKey = 'rnWKup5uNSnxrdRK8SmPx75sZNQN9pFUAIt23ijs';

class UploadService extends Service {
  // 文件上传
  async upload(file) {
    return file;
  }

  // 获取 qn 上传凭证
  async getToken() {
    const mac = new qiniu.auth.digest.Mac(AccessKey, SecretKey);

    // 自定义凭证有效期（示例2小时）
    const options = {
      scope: bucket,
      expires: 7200,
    };

    const putPolicy = new qiniu.rs.PutPolicy(options);
    const token = putPolicy.uploadToken(mac);

    if (token && typeof token === 'string') {
      return {
        retCode: '0',
        errCode: '0',
        errMsg: '',
        data: {
          token,
        },
      };
    }
  }
}

module.exports = UploadService;
