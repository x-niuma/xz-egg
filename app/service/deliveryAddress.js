'use strict';
const cityList = require('../local/city');
const Service = require('egg').Service;

// 自定义错误类型
function MyError({ errMsg, errCode }) {
  this.message = errMsg;
  this.errCode = errCode;
}

class DeliveryAddressService extends Service {
  // 添加地址
  async add({
    uid, 
    mobile, 
    username, 
    address, 
    city,
    province, 
    district,
    zip,
    provinceCode,
    cityCode,
    districtCode
  }) {
    const ret = await this.app.mysql.insert('shipping', {
      mobile, username, address, city, province, district, zip, uid,
      province_code: provinceCode,
      city_code: cityCode,
      district_code: districtCode
    });
    const insertSuccess = ret.affectedRows === 1;
    if (insertSuccess) {
      return {
        errMsg: '',
        errCode: '0',
        retCode: '0'
      }
    } else {
      return {
        errMsg: '添加失败',
        errCode: '1',
        retCode: '1'
      }
    }
  }

  // 更新地址
  async update({
    token,
    id,
    mobile, 
    username, 
    address, 
    city,
    province, 
    district,
    zip,
    provinceCode,
    cityCode,
    districtCode
  }) {
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    const row = {
      mobile,
      username, 
      address, 
      city,
      province,
      district, 
      zip,
      province_code: provinceCode,
      city_code: cityCode,
      district_code: districtCode
    }
    const options = {
      where: {
        id,
        uid
      }
    }
    const ret = await this.app.mysql.update('shipping', row, options);
    const insertSuccess = ret.affectedRows === 1;
    if (insertSuccess) {
      return {
        errMsg: '',
        errCode: '0',
        retCode: '0'
      }
    } else {
      return {
        errMsg: '更新地址失败',
        errCode: '1',
        retCode: '1'
      }
    }
  }

  // 删除地址
  async remove({ id, uid }) {
    const ret = await this.app.mysql.delete('shipping', {
      id,
      uid
    });
    const insertSuccess = ret.affectedRows === 1;
    if (insertSuccess) {
      return {
        errMsg: '',
        errCode: '0',
        retCode: '0'
      }
    } else {
      return {
        errMsg: '删除失败',
        errCode: '1',
        retCode: '1'
      }
    }
  }

  async list(token) {
    const userId = await this.ctx.service.user.getUserIdByToken(token);
    if (!userId) {
      throw new MyError({
        retCode: '1',
        errCode: '100005',
        errMsg: '登录失效',
      });
    }
    const list = await this.app.mysql.select('shipping', {
      where: {
        uid: userId
      }
    });
    return {
      retCode: '0',
      errCode: '0',
      errMsg: 'success',
      data: {
        userId,
        list: JSON.parse(JSON.stringify(list)),
      },
    };
  }

  // 当个地址信息
  async addressInfo(addressId) {
    return addressId;
  }

  // 获取顺丰地址
  async getSfCityList () {
    return {
      retCode: '0',
      errCode: '0',
      errMsg: 'success',
      data: {
        list: cityList
      }
    };
  }
}

module.exports = DeliveryAddressService;
