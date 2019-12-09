// app/controller/xzProduct.js

'use strict';

const Controller = require('egg').Controller;

class XzProductController extends Controller {

  // 所有用户的商品
  async index() {
    const {
      categoryId,
      pageIndex,
      pageSize 
    } = this.ctx.request.query;

    console.log(pageSize, pageIndex);

    this.ctx.body = await this.ctx.service.xzProduct.index({
      categoryId,
      pageIndex,
      pageSize
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
      description,
      depreciation,
      imgs,
      province,
      provinceCode,
      city,
      cityCode,
      district,
      districtCode,
      categoryId,
      categoryName,
      brandId,
      brandName,
      skuId,
      skuName
    } = this.ctx.request.body;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.xzProduct.create({
      uid,
      title,
      price,
      description,
      depreciation,
      imgs,
      province,
      provinceCode,
      city,
      cityCode,
      district,
      districtCode,
      categoryId,
      categoryName,
      brandId,
      brandName,
      skuId,
      skuName
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
      description,
      depreciation,
      imgs,
      province,
      provinceCode,
      city,
      cityCode,
      district,
      districtCode,
      categoryId,
      categoryName,
      brandId,
      brandName,
      skuId,
      skuName
    } = this.ctx.request.body;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.xzProduct.update({
      itemId,
      uid,
      title,
      price,
      description,
      depreciation,
      imgs,
      province,
      provinceCode,
      city,
      cityCode,
      district,
      districtCode,
      categoryId,
      categoryName,
      brandId,
      brandName,
      skuId,
      skuName
    });
  }

  /**
   * 获取指定用户发布的商品
   * 包括上架以及未上架状态
   */
  async getProductByUserId () {
    const { token, pageIndex, pageSize } = this.ctx.request.query;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.xzProduct.index({
      uid,
      pageSize,
      pageIndex,
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