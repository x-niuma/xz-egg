'use strict';

const Service = require('egg').Service;
const formatNum = num => {
  return num > 9 ? num : `0${num}`;
};
function MyError({ errMsg, errCode }) {
  this.message = errMsg;
  this.errCode = errCode;
}

class CheckinService extends Service {
  /**
   * 通过用户ID查询签到状态
   * @param {*} uid 
   */
  async isCheckinedByUid(uid) {
    const date = this.getToday();
    const result = await this.app.mysql.get('checkin', {
      uid,
      date,
    });
    return result;
  }

  /**
   * 通过token查询该用户当天是否签到
   * @param {*} token 
   */
  async isCheckinedByToken(token) {
    const uid = await this.ctx.service.user.checkLogin(token);
    return await this.isCheckinedByUid(uid);
  }

  getToday() {
    const date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();

    y = formatNum(y);
    m = formatNum(m);
    d = formatNum(d);
    return `${y}-${m}-${d}`;
  }

  // 签到
  async checkin(token) {
    const uid = await this.ctx.service.user.checkLogin(token);
    const isCheckined = await this.isCheckinedByUid(uid);
    if (isCheckined) {
      throw new MyError({
        retCode: '1',
        errCode: '',
        errMsg: '请勿重复签到',
      });
    }

    const date = this.getToday();
    await this.app.mysql.insert('checkin', {
      uid,
      date: `${date} 00:00:00`
    });
    const result = await this.app.mysql.insert('point', {
      uid,
      value: 5,
      action: 1,
      create_time: this.getToday(),
      description: '签到获取积分',
    });
    if (result) {
      return {
        retCode: '0',
        errCode: '0',
        errMsg: '',
      };
    }
    throw new MyError({
      retCode: '1',
      errCode: '',
      errMsg: result,
    });
  }

  async checkinStatus(token) {
    const uid = await this.ctx.service.user.checkLogin(token);
    const isCheckined = await this.isCheckinedByUid(uid);
    return { retCode: '0', errCode: '0', errMsg: '', data: { status: isCheckined ? 1 : 0 } };
  }

  // 签到流水
  async list(token) {
    const { app } = this;
    const uid = await this.ctx.service.user.checkLogin(token);
    const list = await app.mysql.select('checkin', {
      where: {
        uid,
      },
      columns: [ 'date' ],
    });

    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data: {
        list: JSON.parse(JSON.stringify(list)),
      },
    };
  }
}

module.exports = CheckinService;
