'use strict';

const Service = require('egg').Service;

class PointService extends Service {
  async list(token) {
    const uid = await this.ctx.service.user.checkLogin(token);
    const str = `SELECT id, value, action, create_time as createTime, description FROM point WHERE uid = ${+uid}`;
    const list = await this.app.mysql.query(str);
    const total = await this.app.mysql.query(`SELECT COUNT(*) from point WHERE uid = ${+uid}`);

    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data: {
        total: total[0]['COUNT(*)'],
        list
      }
    };
  }
}

module.exports = PointService;
