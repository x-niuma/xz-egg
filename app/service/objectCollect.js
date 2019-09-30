const Service = require('egg').Service;

class ObjectCollectService extends Service {

  /**
   * 查询 指定用户和指定对象 的收藏记录
   */
  async index({ uid, typeId, objectId }) {
    let result = await this.app.mysql.select('object_collect', {
      where: {
        uid: uid,
        type_id: typeId,
        object_id: objectId
      }
    });

    let list = JSON.parse(JSON.stringify(result));

    if (list.length) {
      const itemIdList = [];
      list.forEach(item => {
        itemIdList.push(item.item_id);
      });

      const objectList = await this.app.mysql.select(objectId == 1 ? 'xz_product' : 'demand', {
        where: {
          id: itemIdList
        }
      });

      list.forEach(collectElement => {
        objectList.forEach(objectElement => {
          if (collectElement.item_id === objectElement.id) {
            try {
              objectElement.imgs = JSON.parse(objectElement.imgs);
            } catch (error) {
              console.log(objectElement.imgs);
            }
            collectElement.itemInfo = objectElement;
          }
        });
      });

      // 过滤已经被删除的数据
      const filterList = []
      list.forEach(element => {
        if (element.itemInfo) {
          filterList.push(element)
        }
      })
      list = filterList;
    }

    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data: {
        list: list
      }
    };
  }

  /**
   * 指定用户增加收藏记录
   */
  async create({ uid, itemId, typeId, objectId }) {
    const result = await this.app.mysql.insert('object_collect', {
      uid,
      item_id: itemId,
      type_id: typeId,
      object_id: objectId
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

  /**
   * 删除指定用户的指定收藏记录
   */
  async destroy({ uid, collectId }) {
    const result = await this.app.mysql.delete('object_collect', {
      uid,
      id: collectId
    });
    const insertSuccess = result.affectedRows === 1;
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

  /**
   * 判断用户是否收藏该商品
   */
  async isColletedState({ uid, itemId, typeId, objectId }) {
    const result = await this.app.mysql.select('object_collect', {
      where: {
        uid,
        item_id: itemId,
        type_id: typeId,
        object_id: objectId
      }
    });
    const list = JSON.parse(JSON.stringify(result));
    return {
      errMsg: '',
      errCode: '0',
      retCode: '0',
      data: {
        status: list.length >= 1 ? 1 : 0,
        ...list[0]
      }
    }
  }
}

module.exports = ObjectCollectService;
