/**
 * @documention 聊天
 * @author Gaollard
 */
'use strict';

const Controller = require('egg').Controller;

class CheckinController extends Controller {
  async index() {
    const { token } = this.ctx.request.query;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.chat.index({ uid });
  }

  async show() {
    const { token } = this.ctx.request.query;
    const { partnerId } = this.ctx.params;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.chat.show({ uid, partnerId });
  }
}

module.exports = CheckinController;
