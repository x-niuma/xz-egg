'use strict';

const nodemailer = require('nodemailer');
const Controller = require('egg').Controller;

let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  // secureConnection: true, // 使用了 SSL
  auth: {
    user: '1056834607@qq.com',//你的邮箱
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'alofdtsbmbztbdbi',
  }
});

class CommonController extends Controller {
  /**
   * 获取邮箱注册验证码
   */
  getEmailCode () {
    const { email } = this.ctx.request.body;
    const params = {
      from: '1056834607@qq.com', // sender address
      to: email, // list of receivers
      subject: '注册校验码', // Subject line
      html: '您的注册验证码为：<b>9527</b>，请勿将信息泄露给他人。' // html body
    }
    transporter.sendMail(params, (error, info) => {
      if (error) {
        this.ctx.body = error;
      }
      this.ctx.body = {
        retCode: 0,
        errCode: 0,
        errMsg: ''
      }
    });
  }
}

module.exports = CommonController;
