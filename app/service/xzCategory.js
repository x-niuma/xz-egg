// app/service/xzProduct.js

'use strict';

const Service = require('egg').Service;

class XzCategoryService extends Service {
  async index() {
    let list = await this.app.mysql.select('xz_category');
    list = JSON.parse(JSON.stringify(list));
    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data: {
        list,
      },
    };
  }
}

module.exports = XzCategoryService;