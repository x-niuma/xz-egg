module.exports = app => {
  return async (ctx, next) => {
    ctx.socket.emit('res', '您已连接成功');
    await next();
  };
};