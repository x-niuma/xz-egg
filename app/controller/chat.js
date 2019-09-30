'use strict';

const Controller = require('egg').Controller;

/**
 * @documention: 聊天
 * @author Gaollard
 */
class CheckinController extends Controller {
  async index() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.chat.index({ uid });
  }

  async show() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    const { partnerId } = this.ctx.params;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.chat.show({ uid, partnerId });
  }
}

module.exports = CheckinController;
