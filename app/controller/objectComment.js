const Controller = require('egg').Controller;

/**
 * 用户对指定商品进行评论, 完成以下功能：
 * 1. 增加评论
 * 2. 查询评论
 * 3. 删除评论
 * 4.
 *    typeId = 1 表示对商品进行评论 此时 itemId 为商品ID
 *    typeId = 2 表示对评论进行评论 此时 itemId 为评论ID
 */

class ObjectCommentController extends Controller {
  
  /**
   * 查询评论
   */
  async index() {
    const { token, itemId, typeId } = this.ctx.request.query;
    this.ctx.body = await this.ctx.service.objectComment.index({
      itemId,
      typeId: typeId || 1
    });
  }

  /**
   * 新增评论
   */
  async create() {
    const { content, typeId, talkTo, parentId } = this.ctx.request.body;
    const { token, itemId  } = this.ctx.request.query;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.objectComment.create({
      uid,
      itemId,
      content,
      talkTo,
      typeId,
      parentId
    });
  }

  /**
   * 删除评论
   */
  async destroy() {
    const { collectId } = this.ctx.params;
    const { token } = this.ctx.request.query;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.objectComment.destroy({
      uid,
      collectId
    });
  }
}

module.exports = ObjectCommentController;
