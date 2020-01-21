// app/controller/point.js
'use strict';

const Controller = require('egg').Controller;

class PointController extends Controller {
  async list() {
    const { ctx } = this;
    const { token, pageIndex, pageSize } = ctx.request.query;
    this.ctx.body = await this.ctx.service.point.list(token, pageIndex, pageSize);
  }
}

module.exports = PointController;
