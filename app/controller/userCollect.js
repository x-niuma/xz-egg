
'use strict';

const Controller = require('egg').Controller;

class UserCollectController extends Controller {

  // 获取我关注的用户
  async followList() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    const uid = await ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await ctx.service.userCollect.followList({ uid });
  }

  // 添加对某个用户的关注
  async addFollow() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    const { followId } = ctx.request.body;
    const uid = await ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await ctx.service.userCollect.addFollow({ uid, followId });
  }

  // 取消对某个用户的关注
  async remove() {
    const { ctx } = this;
    const { followId } = ctx.params;
    const { token } = ctx.request.query;
    const uid = await ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await ctx.service.userCollect.remove({ uid, followId });
  }
}

module.exports = UserCollectController;
