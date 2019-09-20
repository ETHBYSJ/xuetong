let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {

    }
  }
  consult() {
    console.log("consult")
  }
  //返回首页
  toIndex() {
    console.log("toIndex")
    wx.switchTab({
      url: '/pages/activity/index/index',
    })
  }
}