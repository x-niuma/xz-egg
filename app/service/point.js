'use strict';

const Service = require('egg').Service;

class PointService extends Service {
  async list(token, pageIndex = 0, pageSize = 20) {
    const uid = await this.ctx.service.user.checkLogin(token);
    const str = `SELECT id, value, action, create_time as createTime, description FROM point WHERE uid = ${+uid} limit ${+pageSize} offset ${+pageIndex * +pageSize}`;
    const list = await this.app.mysql.query(str);
    const total = await this.app.mysql.query(`SELECT COUNT(*) from point WHERE uid = ${+uid}`);

    // let list = await this.app.mysql.select('xz_product', {
    //   where: {
    //     uid
    //   },
    //   limit: +pageSize,
    //   offset: +pageIndex * +pageSize
    // });

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
