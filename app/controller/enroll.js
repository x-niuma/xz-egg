'use strict'

const Controller = require('egg').Controller

class EnrollController extends Controller {
  // 指定项目报名
  async create() {
    const { token, projectId } = this.ctx.request.query
    const uid = await this.ctx.service.user.getUserIdByToken(token)
    this.ctx.body = await this.ctx.service.enroll.create({
      uid,
      projectId
    })
  }

  // 查询指定项目的报名列表
  async list() {
    const { projectId } = this.ctx.request.query
    this.ctx.body = await this.ctx.service.enroll.list({
      projectId
    })
  }

  // 判断用户是否已经报名
  async getEnrollStatus() {
    const { token, projectId } = this.ctx.request.query
    const uid = await this.ctx.service.user.getUserIdByToken(token)
    this.ctx.body = await this.ctx.service.enroll.getEnrollStatus({
      uid,
      projectId
    })
  }

  // 获取指定用户报名的项目列表
  async getUserEnrollList() {
    const { token, pageSize, pageIndex } = this.ctx.request.query
    const uid = await this.ctx.service.user.getUserIdByToken(token)
    this.ctx.body = await this.ctx.service.enroll.getUserEnrollList({
      uid,
      pageSize,
      pageIndex
    })
  }
}

module.exports = EnrollController
