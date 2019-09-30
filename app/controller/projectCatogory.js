'use strict';

const Controller = require('egg').Controller;

/**
 * @documention: 项目分类
 * @author Gaollard
 */
class ProjectCategoryController extends Controller {
  /**
   * @description 查询需求分类列表
   */
  async list() {
    this.ctx.body = await this.ctx.service.projectCategory.list();
  }
}

module.exports = ProjectCategoryController;
