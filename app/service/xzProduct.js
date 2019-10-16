// app/service/xzProduct.js

'use strict';

const Service = require('egg').Service;

class XzProductService extends Service {

  /**
   * 查询闲置商品
   * @param uid 用户ID
   * @param categoryId 类目ID
   */
  async index({ uid, categoryId }) {
    let list
    let options = {}
    if (uid) {
      options.uid = uid
    }
    if (categoryId) {
      options.category_id = categoryId
    }

    list = await this.app.mysql.select('xz_product', {
      where: options
    });
    
    list = JSON.parse(JSON.stringify(list));

    list.forEach(element => {
      if (element.imgs) {
        element.imgs = JSON.parse(element.imgs);
      }
    });

    if (list.length) {
      const uidList = []
      list.forEach(item => {
        uidList.push(item.uid);
      });
  
      const userList = await this.app.mysql.select('user', {
        where: {
          id: uidList
        }
      });
  
      list.forEach(productElement => {
        userList.forEach(userElement => {
          if (productElement.uid === userElement.id) {
            productElement.userInfo = userElement;
          }
        });
      });
    }

    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data: {
        list
      }
    };
  }

  /**
   * 闲置商品详情
   */
  async show(itemId) {
    const data = await this.app.mysql.get('xz_product', {
      id: itemId
    });

    if (!data) {
      throw {
        retCode: '1',
        errCode: '1',
        errMsg: '该商品不存在'
      }
    }

    data.imgs = JSON.parse(data.imgs);

    // 作者
    let user = await this.app.mysql.get('user', {
      id: data.uid
    });
    data.user = user;

    let colleted = false;

    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data
    };
  }

  /**
   * 创建 xzProduct
   */
  async create({
    uid,
    title,
    price,
    city,
    description,
    depreciation,
    imgs,
    categoryId,
    tradeWayId
  }) {
    const result = await this.app.mysql.insert('xz_product', {
      uid,
      title,
      price,
      city,
      description,
      depreciation,
      imgs,
      category_id: categoryId,
      trade_way_id: tradeWayId
    });
    if (result.affectedRows === 1) {
      return {
        errMsg: '',
        errCode: '0',
        retCode: '0'
      }
    } else {
      return {
        errMsg: '发布失败',
        errCode: '1',
        retCode: '1'
      }
    }
  }

  /**
   * 更新 xzProduct
   */
  async update({
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
  }) {
    const row = {
      title,
      price,
      city,
      description,
      depreciation,
      imgs,
      category_id: categoryId,
      trade_way_id: tradeWayId
    }
    const options = {
      where: {
        id: itemId
      }
    }
    const result = await this.app.mysql.update('xz_product', row, options);
    if (result.affectedRows === 1) {
      return {
        errMsg: '',
        errCode: '0',
        retCode: '0'
      }
    } else {
      return {
        errMsg: '发布失败',
        errCode: '1',
        retCode: '1'
      }
    }
  }

  async search({ keyword }) {
    let list = [];
    if (keyword) {
      let sql = `SELECT * FROM xz_product WHERE POSITION("${keyword}" IN title);`
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

module.exports = XzProductService;