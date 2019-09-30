// {app_root}/app/io/controller/chat.js

const Controller = require('egg').Controller;

class ChatController extends Controller {
  async sendMsg() {
    const { ctx, app, service } = this;
    const chat = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;
    const query = socket.handshake.query;

    try {
      const { target, payload } = message;
      const msg = ctx.helper.parseMsg('receiveMsg', payload, {
        client,
        target: ''
      });
      const userInfo = await service.user.getUserInfo({
        token: query.token
      });
      msg.data.payload.userInfo = userInfo.data;
      const ret = await service.chat.create({
        from: +payload.from,
        to: +payload.to,
        content: payload.content
      });
      
      Object.assign(msg.data.payload, ret.data);
      chat.emit('sendMsg_' + payload.to, msg);
      chat.emit('sendMsg_' + payload.from, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }

  async receiveAllMsg () {
    const { ctx, app, service } = this;
    const chat = app.io.of('/');
    const socket = ctx.socket;
    const message = ctx.args[0] || {};
    const client = socket.id;
    const query = socket.handshake.query;

    const { target, payload } = message;
    console.log(message);

    const uid = await service.user.getUserIdByToken(query.token);
    const ret = await service.chat.index({ uid });

    try {
      chat.emit(target, {
        payload: payload,
        uid,
        ...ret.data
      });
    } catch (error) {
      app.logger.error(error);
    }
  }
}

module.exports = ChatController;
