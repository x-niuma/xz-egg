/**
 * @documention 签到
 * @author Gaollard
 */

'use strict';

const Controller = require('egg').Controller;

class CheckinController extends Controller {
  /**
   * @description 签到
   */
  async checkin() {
    const { token } = this.ctx.request.query;
    this.ctx.body = await this.ctx.service.checkin.checkin(token);
  }

  /**
   * @description 查询签到状态
   */
  async checkinStatus() {
    const { token } = this.ctx.request.query;
    this.ctx.body = await this.ctx.service.checkin.checkinStatus(token);
  }

  /**
   * @description 查询签到流水
   */
  async list() {
    const { token } = this.ctx.request.query;
    this.ctx.body = await this.ctx.service.checkin.list(token);
  }
}

module.exports = CheckinController;
