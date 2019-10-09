const only = require('only');
const Service = require('egg').Service;

const USER_TABLE_NAME = 'user';
const CUR_TABLE_NAME = 'object_comment';

class ObjectCommentService extends Service {

  /**
   * 查询评论
   */
  async index({ itemId, typeId }) {
    let commentList = await this.app.mysql.select(CUR_TABLE_NAME, {
      where: {
        item_id: itemId,
        type_id: typeId
      }
    });
    commentList = JSON.parse(JSON.stringify(commentList));

    // 所有用户
    let userList = await this.app.mysql.select(USER_TABLE_NAME);
    userList = JSON.parse(JSON.stringify(userList));

    // 查找评论的用户信息
    commentList.forEach(element => {
      userList.forEach(childElement => {
        if (element.uid === childElement.id) {
          element.userInfo = childElement;
          delete element.userInfo.password;
        }
      });
    });

    if (commentList.length) {
      // 获取子评论
      let ret = await this.app.mysql.select(CUR_TABLE_NAME, {
        where: {
          talk_to: commentList.map(element => element.id),
          type_id: 2
        }
      });
      ret = JSON.parse(JSON.stringify(ret));
      commentList.forEach(element => {
        element.children = ret.filter(child => child.talk_to == element.id)
        element.children.forEach(element => {
          userList.forEach(childElement => {
            if (element.uid === childElement.id) {
              element.userInfo = childElement;
              delete element.userInfo.password;
            }
          });
        });
      })
    }

    return {
      retCode: 0,
      errCode: 0,
      errMsg: '',
      data: {
        list: commentList
      }
    };
  }

  /**
   * 增加评论
   */
  async create({ uid, itemId, content, talkTo, typeId = 1 }) {
    if (+typeId === 2) {
      const result = await this.app.mysql.insert(CUR_TABLE_NAME, {
        uid,
        type_id: typeId,
        talk_to: talkTo,
        item_id: itemId,
        content: content
      });
      const insertSuccess = result.affectedRows === 1;
      if (insertSuccess) {
        return {
          errMsg: '',
          errCode: '0',
          retCode: '0'
        }
      }      
    } else {
      const result = await this.app.mysql.insert(CUR_TABLE_NAME, {
        uid,
        type_id: typeId,
        item_id: itemId,
        content: content
      });
      const insertSuccess = result.affectedRows === 1;
      if (insertSuccess) {
        return {
          errMsg: '',
          errCode: '0',
          retCode: '0'
        }
      }      
    }
  }
}

module.exports = ObjectCommentService;
