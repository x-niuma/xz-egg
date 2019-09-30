'use strict'
// const payload = {
//   data: {
//     action: 'exchange', // 'deny' || 'exchange' || 'broadcast'
//     payload: {}
//   },
//   meta: {
//     timestamp: 1512116201597,
//     client: '/webrtc#nNx88r1c5WuHf9XuAAAB',
//     target: '/webrtc#nNx88r1c5WuHf9XuAAAB'
//   }
// }

module.exports = {
  parseMsg(action, payload = {}, metaData = {}) {
    const meta = {
      timestamp: Date.now()
    }
    Object.assign(meta, metaData)
    return {
      data: {
        action,
        payload
      },
      meta
    }
  }
}
