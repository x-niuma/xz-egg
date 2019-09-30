// app/controller/upload.js

'use strict';

const Controller = require('egg').Controller;

class UploadController extends Controller {

  // 获取 qn 上传凭证
  async getToken() {
    const token = await this.ctx.service.upload.getToken();
    this.ctx.body = token;
  }
}

module.exports = UploadController;
