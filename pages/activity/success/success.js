let we = require('../../../we/index.js')


new class extends we.Page {
  data() {
    return {
      //订单id
      orderId: "",
    }
  }
  onLoad(options) {
    console.log(options)
    this.setData({
      orderId: options.id,
    })
  }
  //查看报名详情
  detail() {
    console.log("detail")
    let that = this
    wx.navigateTo({
      url: '/pages/activity/payment/payment?id=' + that.data.orderId,
    })
  }
  //返回首页
  toIndex() {
    console.log("toIndex")
    wx.switchTab({
      url: '/pages/activity/index/index',
    })
  }
}