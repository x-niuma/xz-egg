// app/controller/zxCategory.js

'use strict';

const Controller = require('egg').Controller;

class XzCategoryController extends Controller {
  async index() {
    this.ctx.body = await this.ctx.service.xzCategory.index();
  }
}

module.exports = XzCategoryController;