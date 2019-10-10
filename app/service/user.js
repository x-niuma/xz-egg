'use strict';
const Service = require('egg').Service;
const utility = require('utility');

// 自定义错误类型
function MyError({ errMsg, errCode }) {
  this.message = errMsg;
  this.errCode = errCode;
}

// 获取n个随机数
function getRandoms(n = 5) {
  let result = '';
  for (let i = 0; i < n; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

// 创建登录token
function createToken(pwd) {
  return utility.md5(`${pwd}&salt=WK1hg2d90l&random=${getRandoms(5)}`);
}

class UserService extends Service {
  /**
   * @description 用户注册
   * @param {String} param0 
   */
  async register({ mobile, password }) {
    let user = await this.app.mysql.get('user', { mobile });
    user = JSON.stringify(user);
    user = JSON.parse(user);
    if (user) {
      throw new MyError({
        errCode: '100001',
        errMsg: '该手机号已经被使用'
      });
    }
    // 插入新用户
    let result = await this.app.mysql.insert('user', {
      mobile,
      password
    });

    if (result.affectedRows !== 1) {
      return {
        retCode: '1',
        errCode: '1',
        errMsg: '注册失败'
      };
    }

    user = await this.app.mysql.get('user', { mobile });
    user = JSON.stringify(user);
    user = JSON.parse(user);

    const loginToken = createToken(password);
    result = await this.app.redis.set(`${loginToken}`, user.id);

    if (result === 'OK') {
      delete user.password;
      return {
        retCode: '0',
        errCode: '0',
        errMsg: 'success',
        data: {
          token: loginToken,
          ...user
        }
      };
    } else {
      return{
        retCode: '1',
        errCode: '100004',
        errMsg: result || '登录失败'
      };
    }
  }

  // 用户登录
  async login({ mobile, password }) {
    let user = await this.app.mysql.get('user', { mobile });
    user = JSON.stringify(user);
    user = JSON.parse(user);

    // 手机号注册
    if (!user) {
      throw new MyError({
        retCode: '1',
        errCode: '100003',
        errMsg: '该手机号未注册'
      });
    }

    // 密码不正确
    if (user.password !== password) {
      throw new MyError({
        retCode: '1',
        errCode: '100004',
        errMsg: '登录密码不正确'
      });
    }

    const loginToken = createToken(password);
    let result = await this.app.redis.set(`${loginToken}`, user.id);
    if (result === 'OK') {
      delete user.password;
      return {
        retCode: '0',
        errCode: '0',
        errMsg: 'success',
        data: {
          token: loginToken,
          ...user
        }
      };
    } else {
      throw new MyError({
        retCode: '1',
        errCode: '100004',
        errMsg: result || '登录失败'
      });
    }
  }

  // 获取用户信息
  async getUserInfo({ token }) {
    let userId = await this.getUserIdByToken(token);
    if (!userId) {
      throw new MyError({
        retCode: '1',
        errCode: '100005',
        errMsg: '登录失效'
      });
    }

    let user = await this.app.mysql.get('user', { id: userId });
    if (user) {
      delete user.password;
      return {
        retCode: '0',
        errCode: '0',
        errMsg: 'success',
        data: user
      };
    } else {
      throw new MyError({
        retCode: '1',
        errCode: '100003',
        errMsg: '该手机号未注册'
      });
    }
  }

  // 更新用户信息
  async updateUserInfo({ nickname, avatar, gender, email, token }) {
    const uid = await this.getUserIdByToken(token);

    if (!uid) {
      throw new MyError({
        retCode: '1',
        errCode: '100005',
        errMsg: '登录已失效'
      });
    }

    const params = {};
    if (nickname) params.nickname = nickname;
    if (avatar) params.avatar = avatar;
    if (gender) params.gender = gender;
    if (email) params.email = email;

    if (Object.keys(params).length === 0) {
      throw new MyError({
        retCode: '1',
        errCode: '100007',
        errMsg: '您未修改信息'
      });
    }

    const result = await this.app.mysql.update('user', {
      id: parseInt(uid),
      ...params
    });

    if (result.affectedRows === 1) {
      return {
        retCode: '0',
        errCode: '0',
        errMsg: 'success'
      };
    }
  }

  // 通过 token 查询 用户ID
  async getUserIdByToken(token) {
    return await this.app.redis.get(token);
  }

  /**
   * 检测用户是否登录
   * @param {String} token 
   */
  async checkLoginState({ token }) {
    let uid = await this.getUserIdByToken(token)
    return {
      errMsg: '',
      retCode: 0,
      errCode: 0,
      data: {
        status: uid ? 1 : 0
      }
    }
  }

  /**
   * 判断用户登录是否有效
   * 1. 无效 返回false
   * 2. 有效 返回用户ID
   */
  async checkLogin(token) {
    const uid = await this.app.redis.get(token);
    if (!uid) {
      throw new MyError({
        retCode: '1',
        errCode: '100005',
        errMsg: '登录已失效'
      });
    }
    return uid;
  }

  // 获取用户发布的闲置商品
  async getUserXzProduct(token) {
    const uid = await this.app.redis.get(token);
    if (!uid) {
      throw new MyError({
        retCode: '1',
        errCode: '100005',
        errMsg: '登录已失效'
      });
    }
    return this.ctx.service.xzProduct.index(uid);
  }

  async getUserTotalInfo ({ token }) {
    const uid = await this.app.redis.get(token);
    if (!uid) {
      throw new MyError({
        retCode: '1',
        errCode: '100005',
        errMsg: '登录已失效'
      });
    }
    const followListList =  await this.ctx.service.userCollect.followList({
      uid
    })
    const likeList = await this.ctx.service.objectCollect.index({
      uid: uid,
      typeId: 2,
      objectId: 1
    })
    const collectList = await this.ctx.service.objectCollect.index({
      uid: uid,
      typeId: 1,
      objectId: 1
    })
    const pointRet = await this.ctx.service.point.list(token);
    let pointNum = 0;
    if (pointRet.errCode == 0) {
      const list = pointRet.data.list;
      list.forEach(element => {
        pointNum += element.value
      })
    }
    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data: {
        followNum: followListList.data.list.length,
        collectNum: collectList.data.list.length,
        likeNum: likeList.data.list.length,
        pointNum
      }
    }
  }

  // 获取用户介绍信息
  async getUserProfile ({ uid }) {
    let user = await this.app.mysql.get('user', { id: uid });
    if (user) {
      delete user.password;
      return {
        retCode: '0',
        errCode: '0',
        errMsg: 'success',
        data: user
      };
    } else {
      throw new MyError({
        retCode: '1',
        errCode: '100003',
        errMsg: '用户不存在'
      });
    }    
  }
}

module.exports = UserService;
