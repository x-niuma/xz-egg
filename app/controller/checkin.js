'use strict';

const Controller = require('egg').Controller;

class CheckinController extends Controller {
  async checkin() {
    const { ctx } = this;
    const { token } = ctx.request.query;

    this.ctx.body = await this.ctx.service.checkin.checkin(token);
  }

  async checkinStatus() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    this.ctx.body = await this.ctx.service.checkin.checkinStatus(token);
  }

  async list() {
    const { ctx } = this;
    const { token } = ctx.request.query;

    this.ctx.body = await this.ctx.service.checkin.list(token);
  }
}

module.exports = CheckinController;
