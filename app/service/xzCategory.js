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
        if (findIndex !== -1) {
          if (!structedList[findIndex].children) {
            structedList[findIndex].children = [];
          }
          structedList[findIndex].children.push(element)
        }
      }
    });

    structedList.forEach((element, elementIndex) => {
      element.children.forEach((childElement, childIndex) => {
        list.forEach(element => {
          if (element.parent_id === childElement.id) {
            if (!childElement.children) {
              childElement.children = [];
            }
            childElement.children.push(element);
          }
        });
      })
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