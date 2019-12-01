// app/service/xzProduct.js

'use strict';

const Service = require('egg').Service;

class XzCategoryService extends Service {
  async index() {
    let list = await this.app.mysql.select('xz_category');
    list = JSON.parse(JSON.stringify(list));

    const structedList = [];
    list.forEach(element => {
      if (!element.parent_id) {
        structedList.push({
          ...element,
          children: []
        });
      }
    })

    list.forEach(element => {
      if (element.parent_id) {
        const findIndex = structedList.findIndex((item) => item.id === element.parent_id);
        structedList[findIndex].children.push(element)
      }
    })

    const compare = (a, b) => a.sort_num - b.sort_num;
    structedList.sort(compare);
    structedList.forEach((el, elIndex) => {
      (structedList[elIndex].children || []).sort(compare);
    })

    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data: {
        list: structedList
      },
    };
  }
}

module.exports = XzCategoryService;