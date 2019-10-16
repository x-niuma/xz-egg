// app/controller/xzProduct.js

'use strict';

const Controller = require('egg').Controller;

class XzProductController extends Controller {

  // 所有用户的商品
  async index() {
    const { categoryId } = this.ctx.request.query;
    this.ctx.body = await this.ctx.service.xzProduct.index({
      categoryId
    });
  }

  // 商品详情
  async show() {
    const { itemId } = this.ctx.params;
    this.ctx.body = await this.ctx.service.xzProduct.show(itemId);
  }

  /**
   * @description 用户创建商品
   */
  async create() {
    const { token } = this.ctx.request.query;
    const {
      title,
      price,
      city,
      description,
      depreciation,
      imgs,
      categoryId,
      tradeWayId
    } = this.ctx.request.body;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.xzProduct.create({
      uid,
      title,
      price,
      city,
      description,
      depreciation,
      imgs,
      categoryId,
      tradeWayId
    });
  }

  /**
   * 更新商品
   */
  async update () {
    const { token } = this.ctx.request.query;
    const { itemId } = this.ctx.params;
    const {
      title,
      price,
      city,
      description,
      depreciation,
      imgs,
      categoryId,
      tradeWayId
    } = this.ctx.request.body;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.xzProduct.update({
      itemId,
      uid,
      title,
      price,
      city,
      description,
      depreciation,
      imgs,
      categoryId,
      tradeWayId
    });
  }

  /**
   * 获取指定用户发布的商品
   * 包括上架以及未上架状态
   */
  async getProductByUserId () {
    const { token } = this.ctx.request.query;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.xzProduct.index({
      uid
    });
  }

  async search () {
    const { keyword } = this.ctx.request.query;
    this.ctx.body = await this.ctx.service.xzProduct.search({
      keyword
    })
  }
}

module.exports = XzProductController;