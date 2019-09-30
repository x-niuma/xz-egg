'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  /**
   * @description 登录
   */
  async login() {
    const { ctx } = this;
    const { mobile, password } = ctx.request.body;
    const res = await ctx.service.user.login({
      mobile,
      password
    });
    ctx.body = res;
  }

  /**
   * @description 注册
   */
  async register() {
    const { ctx } = this;
    const { mobile, password } = ctx.request.body;
    const res = await ctx.service.user.register({
      mobile,
      password
    });
    ctx.body = res;
  }

  /**
   * @description 获取用户信息
   */
  async getUserInfo() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    const res = await ctx.service.user.getUserInfo({
      token
    });
    ctx.body = res;
  }

  /**
   * @description 更新用户信息
   */
  async updateUserInfo() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    const { nickname, avatar, gender, email } = ctx.request.body;
    const res = await ctx.service.user.updateUserInfo({
      token,
      nickname,
      avatar,
      gender,
      email
    });
    ctx.body = res;
  }

  /**
   * @description 更新登录密码
   */
  async updateLoginPassword() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    const { newPassword, password } = ctx.request.body;
    const res = await ctx.service.user.updateLoginPassword({
      token,
      newPassword,
      password
    });
    ctx.body = res;
  }

  /**
   * @description 获取用户介绍信息
   */
  async getUserProfile() {
    const { ctx } = this;
    const { uid } = ctx.request.query;
    const result = await ctx.service.user.getUserProfile({
      uid
    });
    ctx.body = result;
  }

  /**
   * @description 检查用户登录态
   */
  async checkLogin() {
    const { ctx } = this;
    const { token } = ctx.request.query;
    ctx.body = await ctx.service.user.checkLoginState({
      token
    });
  }
}

module.exports = UserController;
