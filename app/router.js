'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app
  router.get('/', controller.home.index)

  // 用户模块----------------------------------------------------------------------------------
  router.post('/user/login', controller.user.login)
  router.post('/user/register', controller.user.register)
  router.get('/user/checkLogin', controller.user.checkLogin)
  router.get('/user/userInfo', controller.user.getUserInfo)
  router.post('/user/userInfo', controller.user.updateUserInfo)
  router.get('/user/profile', controller.user.getUserProfile)
  // router.get('/user/follow', controller.userCollect.followList) // 获取我关注的人
  // router.post('/user/follow', controller.userCollect.addFollow) // 添加关注
  // router.delete('/user/follow/:followId', controller.userCollect.remove) // 取消关注

  // 签到模块 -----------------------------------------------------------------------------------
  router.post('/checkin', controller.checkin.checkin) // 签到
  router.get('/checkin', controller.checkin.checkinStatus) // 签到
  router.get('/checkin/list', controller.checkin.list) // 查询签到流水

  // 积分模块 -----------------------------------------------------------------------------------
  router.get('/point/list', controller.point.list) // 分页查询积分

  // 地址管理 -----------------------------------------------------------------------------------
  router.get('/deliveryAddress', controller.deliveryAddress.list)
  router.post('/deliveryAddress', controller.deliveryAddress.add)
  router.delete('/deliveryAddress/:id', controller.deliveryAddress.remove)
  router.get('/sfCity', controller.deliveryAddress.getSfCityList)

  // 需求模块 --------------------------------------------------------------------------------------------
  router.get('/demand', controller.demand.list)
  router.get('/demand/search', controller.demand.search)
  router.get('/demand/getUserCreateList', controller.demand.getUserCreateList)
  router.post('/demand', controller.demand.create)
  router.get('/demand/:itemId', controller.demand.show)
  router.get('/projectCategory', controller.projectCatogory.list)

  // 报名
  router.get('/enroll', controller.enroll.list)
  router.post('/enroll', controller.enroll.create)
  router.get('/enrollStatus', controller.enroll.getEnrollStatus)
  router.get('/userEnrollList', controller.enroll.getUserEnrollList)

  // qn 文件上传
  router.get('/upload/getToken', controller.upload.getToken)

  // 收藏模块 --------------------------------------------------------------------------------
  router.get('/collect', controller.objectCollect.index)
  router.post('/collect', controller.objectCollect.create)
  router.get('/collect/:itemId', controller.objectCollect.isColletedState)
  router.delete('/collect/:collectId', controller.objectCollect.destroy)

  // 评论模块 ------------------------------------------------------------------------------------
  router.get('/comment', controller.objectComment.index)
  router.post('/comment', controller.objectComment.create)

  // 聊天 ----------------------------------------------------------------------------------------
  router.get('/chat', controller.chat.index)
  router.get('/chat/:partnerId', controller.chat.show)

  // socket
  io.of('/').route('sendMsg', io.controller.chat.sendMsg)
  io.of('/').route('receiveAllMsg', io.controller.chat.receiveAllMsg)
}
