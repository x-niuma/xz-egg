
'use strict';

const Controller = require('egg').Controller;

class DemandController extends Controller {
  /**
   * @description 查询所有用户所发布
   */
  async list() {
    const { ctx } = this;
    const {
      pageIndex,
      pageSize,
      appType,
      projectType
    } = ctx.request.query
    ctx.body = await ctx.service.demand.list({
      pageSize: +pageSize,
      pageIndex: +pageIndex,
      appType: appType,
      projectType: projectType
    });
  }

  async getUserCreateList() {
    const { ctx } = this
    const {
      pageIndex,
      pageSize,
      appType,
      projectType,
      token
    } = this.ctx.request.query
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    ctx.body = await ctx.service.demand.list({
      uid,
      pageSize: +pageSize,
      pageIndex: +pageIndex,
      appType: appType,
      projectType: projectType,
    });
  }

  async show() {
    const { itemId } = this.ctx.params;
    this.ctx.body = await this.ctx.service.demand.show({
      itemId
    });
  }

  async create() {
    const { token } = this.ctx.request.query;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    const {
      title,
      reward,
      category,
      requires,
      description,
      appType,
      projectType
    } = this.ctx.request.body;
    this.ctx.body = await this.ctx.service.demand.create({
      uid,
      title,
      reward,
      category,
      requires,
      description,
      appType,
      projectType
    });
  }

  async search () {
    const { keyword } = this.ctx.request.query;
    this.ctx.body = await this.ctx.service.demand.search({
      keyword
    })
  }
}

module.exports = DemandController;
