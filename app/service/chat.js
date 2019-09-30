'use strict'

const Service = require('egg').Service

class ChatService extends Service {
  // 指定用户的消息列表
  async index({ uid }) {
    let sql = `select * from chat where (f_from = ? or f_to = ?)`
    let result = await this.app.mysql.query(sql, [+uid, +uid])

    const msgList = JSON.parse(JSON.stringify(result))
    let uidList = []
    let userList = []

    if (msgList.length) {
      msgList.forEach(item => {
        if (item.f_from == uid) {
          uidList.push(item.f_to)
        } else {
          uidList.push(item.f_from)
        }
      })
      const selectUserListRet = await this.app.mysql.select('user', {
        where: {
          id: uidList
        }
      })
      userList = JSON.parse(JSON.stringify(selectUserListRet))
    }

    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data: {
        msgList: msgList,
        userList: userList
      }
    }
  }

  /**
   * 获取与指定用户的聊天列表
   */
  async show({ uid, partnerId }) {
    let result = await this.app.mysql.select('chat', {
      where: {
        f_from: [uid, partnerId],
        f_to: [uid, partnerId]
      }
    })

    const msgList = JSON.parse(JSON.stringify(result))
    const partnerInfo = await this.app.mysql.get('user', {
      id: partnerId
    })

    return {
      retCode: '0',
      errCode: '0',
      errMsg: '',
      data: {
        msgList: msgList,
        partnerInfo: partnerInfo
      }
    }
  }

  // 发送消息
  async create({ from, to, content }) {
    const values = {
      f_from: from,
      f_to: to,
      content,
      create_time: new Date()
    }
    const result = await this.app.mysql.insert('chat', values)
    const insertSuccess = result.affectedRows === 1
    if (insertSuccess) {
      return {
        errMsg: '',
        errCode: 0,
        retCode: 0,
        data: values
      }
    }
    return {
      retCode: 1,
      errCode: 1,
      errMsg: '发送错误'
    }
  }
}

module.exports = ChatService
