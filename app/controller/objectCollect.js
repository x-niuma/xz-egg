const Controller = require('egg').Controller;

/**
 * 用户对指定商品进行数据采集
 * typeId = 1 表示收藏
 * typeId = 2 表示点赞
 * objectId = 1 表示闲置商品
 * objectId = 2 表示需求
 */

class ObjectCollectController extends Controller {
  
  /**
   * 查询指定用户的采集记录
   */
  async index() {
    const { token, typeId, objectId } = this.ctx.request.query;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.objectCollect.index({
      uid,
      typeId: typeId || 1,
      objectId: objectId || 1
    });
  }

  /**
   * 用户新增采集记录
   */
  async create() {
    const { itemId } = this.ctx.request.body;
    const { token, typeId, objectId } = this.ctx.request.query;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.objectCollect.create({
      uid,
      itemId,
      typeId: typeId || 1,
      objectId: objectId || 1
    });
  }

  /**
   * 用户删除指定采集记录
   */
  async destroy() {
    const { collectId } = this.ctx.params;
    const { token } = this.ctx.request.query;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.objectCollect.destroy({
      uid,
      collectId
    });
  }

  /**
   * 判断用户是否已经采集过该商品
   */
  async isColletedState() {
    const { token, typeId, objectId } = this.ctx.request.query;
    const { itemId } = this.ctx.params;
    const uid = await this.ctx.service.user.getUserIdByToken(token);
    this.ctx.body = await this.ctx.service.objectCollect.isColletedState({
      uid,
      itemId,
      typeId: typeId || 1,
      objectId: objectId || 1
    });
  }
}

module.exports = ObjectCollectController;
