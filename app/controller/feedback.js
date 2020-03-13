/**
 * @documention 意见反馈
 * @author Gaollard
 */

'use strict';

const Controller = require('egg').Controller;

class FeedbackController extends Controller {
	/**
	 * @description 用户提交反馈
	 */
  async add() {
    const { token } = this.ctx.request.query;
    const userService = this.ctx.service.user;
    const feedbackService = this.ctx.service.feedback;

    const {
    	typeId,
    	title,
    	content
    } = this.ctx.request.body;

    const uid = await userService.getUserIdByToken(token);
    this.ctx.body = await feedbackService.index({
    	uid,
    	typeId,
    	title,
    	content
    });
  }

  /**
   * @description 查看提交的反馈信息
   */
  async show() {
    const userService = this.ctx.service.user;
    const feedbackService = this.ctx.service.feedback;
    
    const { token } = this.ctx.request.query;
    const { feedbackId } = this.ctx.params;

    const uid = await userService.getUserIdByToken(token);
    this.ctx.body = await feedbackService.show({
    	uid,
    	feedbackId
   	});
  }
}

module.exports = FeedbackController;
