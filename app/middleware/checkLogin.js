'use strict';

module.exports = () => {
  return async function checkLogin(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);

      // 若未设置http状态码，默认500
      const status = err.status || 500;
      const errCode = err.errCode || '未定义的错误码';
      const retCode = err.retCode || 1;
      const data = err.data || {};

      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const errMsg =
        status === 500 && ctx.app.config.env === 'prod'
          ? 'Internal Server Error'
          : err.message;

      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        errMsg,
        errCode,
        retCode,
        data
      };

      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
};
