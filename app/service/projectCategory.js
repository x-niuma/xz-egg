'use strict';

const Service = require('egg').Service;

/**
 * @documention: 项目分类
 * @author Gaollard
 */
class ProjectCategoryService extends Service {
  async list() {
    const list = await this.app.mysql.select('project_category');
    return {
      retCode: 0,
      errCode: 0,
      errMsg: '',
      data: {
        list
      }
    };
  }
}

module.exports = ProjectCategoryService;
