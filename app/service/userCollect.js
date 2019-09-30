const Service = require('egg').Service;

class UserCollectService extends Service {

  /**
   * 私有方法不对外开放
   * type = 1 表示获取我关注的人
   * type = 2 表示获取关注我的人
   */
  async _getUserList ({ list, type }) {
    const flag = type === 1;
    const uidList = [];

    // 用户ID数组
    list.forEach(item => {
      uidList.push(flag ? item.follow_id : item.uid);
    });

    const userList = await this.app.mysql.select('user', {
      where: {
        id: uidList
      }
    });

    list.forEach(productElement => {
      userList.forEach(userElement => {
        if (flag) {
          if (productElement.follow_id === userElement.id) {
            productElement.userInfo = userElement;
          }
        } else {
          if (productElement.uid === userElement.id) {
            productElement.userInfo = userElement;
          }
        }
      });
    });
  }

  /**
   * 获取我关注的人
   * @param {*} param0 
   */
  async followList ({ uid }) {
    let list = await this.app.mysql.select('user_collect', {
      uid: uid
    });
    list = JSON.parse(JSON.stringify(list));
    await this._getUserList({ list, type : 1 });
    return {
      retCode: 0,
      errCode: 0,
      errMsg: '',
      data: {
        list
      }
    };
  }

  /**
   * 获取关注我的人
   * @param {*} param0 
   */
  async fanList ({ uid }) {
    let list = await this.app.mysql.select('user_collect', {
      follow_id: uid
    });
    list = JSON.parse(JSON.stringify(list));
    await this._getUserList({ list, type: 2 });
    return {
      retCode: 0,
      errCode: 0,
      errMsg: '',
      data: {
        list
      }
    };
  }

  /**
   * 添加关注
   * @param {*} param0 
   */
  async addFollow ({ uid, followId }) {
    let result = await this.app.mysql.insert('user_collect', {
      uid: uid,
      follow_id: followId
    });
    if (result.affectedRows === 1) {
      return {
        retCode: '0',
        errCode: '0',
        errMsg: 'success'
      };
    } else {
      return {
        retCode: '1',
        errCode: '1',
        errMsg: '添加关注失败'
      };
    }
  }

  /**
   * 取消关注
   * @param {*} param0 
   */
  async remove ({ followId, uid }) {
    let result = await this.app.mysql.delete('user_collect', {
      uid: uid,
      follow_id: followId
    });
    if (result.affectedRows >= 1) {
      return {
        retCode: '0',
        errCode: '0',
        errMsg: 'success'
      };
    } else {
      return {
        retCode: '1',
        errCode: '1',
        errMsg: '取消关注失败'
      };
    }
  }
}

module.exports = UserCollectService