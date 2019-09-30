'use strict';

const Service = require('egg').Service;

class PointService extends Service {
  insert({ value }) {
    return value;
  }

  async list(token) {
    const uid = await this.ctx.service.user.checkLogin(token);
    const str = `SELECT id, value, action, create_time as createTime, description FROM point WHERE uid = ${uid}`;
    const list = await this.app.mysql.query(str);
    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data: {
        list: JSON.parse(JSON.stringify(list))
      }
    };
  }
}

module.exports = PointService;
