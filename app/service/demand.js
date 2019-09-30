'use strict';

const Service = require('egg').Service;

class DemandService extends Service {
  // 分页查询项目列表
  async list({
    pageIndex = 0,
    pageSize = 10,
    appType,
    projectType,
    uid
  }) {
    const { app } = this;

    pageIndex = +pageIndex;
    pageSize = +pageSize;

    const condition = {}
    if (appType) condition.app_type = appType
    if (projectType) condition.project_type = projectType
    if (uid) condition.user_id = uid

    let list = await app.mysql.select('demand', {
      where: condition,
      limit: pageSize,
      offset: (pageIndex - 1) * pageSize
    });

    const projectIdList = list.map(element => element.id);
    if (projectIdList.length) {
      const enrollList = await app.mysql.select('enroll', {
        where: {
          project_id: projectIdList
        }
      })
      list.forEach(project => {
        project.enrollList = project.enrollList || []
        enrollList.forEach(enroll => {
          if (project.id === enroll.project_id) {
            project.enrollList.push(enroll)
          }
        })
      })
    }

    let allList = await app.mysql.select('demand', {
      where: condition
    });

    if (list.length) {
      const uidList = []
      list.forEach(item => {
        uidList.push(item.user_id);
      });

      const userList = await this.app.mysql.select('user', {
        where: {
          id: uidList
        }
      });

      list.forEach(pElement => {
        userList.forEach(userElement => {
          if (pElement.user_id === userElement.id) {
            pElement.userInfo = userElement;
          }
        });
      });
    }

    return {
      retCode: 0,
      errCode: 0,
      errMsg: '',
      data: {
        list,
        pageInfo: {
          pageSize,
          pageIndex,
          total: allList.length
        }
      }
    };
  }

  // 获取项目详情
  async show({ itemId }) {
    const data = await this.app.mysql.get('demand', {
      id: itemId
    });
    if (!data) {
      return {
        retCode: 1,
        errCode: 1,
        errMsg: '无效的ID'
      }
    }

    // 作者
    let user = await this.app.mysql.get('user', {
      id: data.user_id
    });

    data.userInfo = user;

    return {
      retCode: 0,
      errCode: 0,
      errMsg: '',
      data
    };
  }

  // 新增项目
  async create({
    uid,
    title,
    reward,
    requires,
    description,
    appType,
    projectType
  }) {
    const result = await this.app.mysql.insert('demand', {
      title,
      reward,
      app_type: appType,
      project_type: projectType,
      requires,
      description,
      user_id: uid
    });
    if (result.affectedRows === 1) {
      return {
        errMsg: '',
        errCode: 0,
        retCode: 0
      }
    } else {
      return {
        errMsg: '发布失败',
        errCode: 1,
        retCode: 1
      }
    }
  }

  async search({ keyword }) {
    let list = [];
    if (keyword) {
      let sql = `SELECT * FROM demand WHERE POSITION("${keyword}" IN title);`
      list = await this.app.mysql.query(sql);
    }
    return {
      errMsg: '',
      errCode: 0,
      retCode: 0,
      data: {
        list: list
      }
    }
  }
}

module.exports = DemandService;
