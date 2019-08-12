//Load we，赋予we的各种初值，见we/index.js
let we = require('./we/index.js')
we({
  router: {
    // maps: require('/pages/util/map')
  }
})

if (!Function.prototype.bind) {
  Function.prototype.bind = function (context, ...args) {
    if (typeof this != 'function') {
      throw new Error('invalid function use bind')
    }

    return (...a) => {
      return this.apply(context, [...args, ...a])
    }
  }
}
//创建App，we.App是Application的重命名，Application中定义了App
new class extends we.App {
  onShow(options) {
    if (options.scene == 1038) {//从另一个小程序返回
      wx.setStorageSync("otherAppBackkData", options.referrerInfo.extraData)
    }
  }
}