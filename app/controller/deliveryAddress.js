// app/controller/demand.js

'use strict';

const Controller = require('egg').Controller;

class DeliveryAddressController extends Controller {
  // 添加收货地址
  async add() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    const { username, mobile, province, city, district, address, zip } = ctx.request.body;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    ctx.body = await ctx.service.deliveryAddress.add({
      username, mobile, province, city, district, address, zip, uid
    });
  }

  // 删除收货地址
  async remove() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    const { id } = this.ctx.params;
    const uid = await ctx.service.user.getUserIdByToken(token);
    ctx.body = await ctx.service.deliveryAddress.remove({
      id,
      uid,
    });
  }

  // 修改收获地址
  async update() {
    const { ctx } = this;
    const { token } = ctx.request.query;

    const { id } = ctx.request.body;
    const { username, mobile, province, city, district, address, zip } = ctx.request.body;
    ctx.body = await ctx.service.deliveryAddress.update(token, id, {
      username, mobile, province, city, district, address, zip,
    });
  }

  // 修改收获地址
  async list() {
    const { ctx } = this;
    const { token } = ctx.request.query;

    ctx.body = await ctx.service.deliveryAddress.list(token);
  }

  async detail() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    const { id } = ctx.request.body;

    ctx.body = await ctx.service.deliveryAddress.list(token, id);
  }

  async getSfCityList () {
    this.ctx.body = await this.ctx.service.deliveryAddress.getSfCityList();
  }
}

module.exports = DeliveryAddressController;
