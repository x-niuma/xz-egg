'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app
  router.get('/', controller.home.index)
  router.get('/home/mainAdvert', controller.home.mainAdvert)
  router.get('/home/mainMenu', controller.home.mainMenu)

  // 用户模块----------------------------------------------------------------------------------
  router.post('/user/login', controller.user.login)
  router.post('/user/register', controller.user.register)
  router.get('/user/checkLogin', controller.user.checkLogin)
  router.get('/user/userInfo', controller.user.getUserInfo)
  router.post('/user/userInfo', controller.user.updateUserInfo)
  router.get('/user/profile', controller.user.getUserProfile)
  router.get('/user/totalInfo', controller.user.getUserTotalInfo)

  // 关注
  router.get('/follow', controller.userCollect.followList) // 获取我关注的人
  router.post('/follow', controller.userCollect.addFollow) // 添加关注
  router.delete('/follow/:followId', controller.userCollect.remove) // 取消关注

  // 签到模块 -----------------------------------------------------------------------------------
  router.post('/checkin', controller.checkin.checkin) // 签到
  router.get('/checkin', controller.checkin.checkinStatus) // 签到
  router.get('/checkin/list', controller.checkin.list) // 查询签到流水

  // 积分模块 -----------------------------------------------------------------------------------
  router.get('/point/list', controller.point.list) // 分页查询积分

  // 地址管理 -----------------------------------------------------------------------------------
  router.get('/deliveryAddress', controller.deliveryAddress.list)
  router.post('/deliveryAddress', controller.deliveryAddress.add)
  router.post('/deliveryAddress/:id', controller.deliveryAddress.update)
  router.delete('/deliveryAddress/:id', controller.deliveryAddress.remove)
  router.get('/sfCity', controller.deliveryAddress.getSfCityList)

  // qn 文件上传
  router.get('/upload/getToken', controller.upload.getToken)

  // 闲置商品 -----------------------------------------------------------------------------------
  router.get('/xzProduct', controller.xzProduct.index)
  router.post('/xzProduct', controller.xzProduct.create)
  router.get('/xzProduct/search', controller.xzProduct.search)
  router.get('/xzProduct/:itemId', controller.xzProduct.show)
  router.post('/xzProduct/:itemId', controller.xzProduct.update)
  router.get('/user/xzProduct', controller.xzProduct.getProductByUserId)
  router.get('/xzCategory', controller.xzCategory.index)

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
