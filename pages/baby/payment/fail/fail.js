let we = require('../../../../we/index.js')


new class extends we.Page {
  data() {
    return {
      
    }
  }
  //继续支付
  repay() {
    console.log("repay")
    wx.navigateBack()
  }
  //返回首页
  toIndex() {
    console.log("toIndex")
    wx.switchTab({
      url: '/pages/activity/index/index',
    })
  }
}