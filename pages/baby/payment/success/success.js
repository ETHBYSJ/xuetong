let we = require('../../../../we/index.js')


new class extends we.Page {
  data() {
    return {
      //托管地址
      gradeAddress: "",
      //托管时间
      gradeTime: "",
      //订单号
      orderId: "",
      //报名费
      payAmount: "",
      //开始日期
      startDate: "",
      //结束日期
      endDate: "",
      //学生姓名
      name: "",
      //学生头像
      img: "",
    }
  }
  onLoad(options) {
    console.log(options)
    this.setData({
      gradeAddress: options.gradeAddress,
      gradeTime: options.gradeTime,
      orderId: options.orderId,
      payAmount: options.payAmount,
      startDate: options.startDate,
      endDate: options.endDate,
      name: options.name,
      img: options.img,
    })
  }
  //查看报名详情
  detail() {
    console.log("detail")
    let that = this
    wx.navigateTo({
      url: '/pages/baby/payment/paymentDetailed/paymentDetailed?gradeAddress=' + that.data.gradeAddress + '&gradeTime=' + that.data.gradeTime + '&orderId=' + that.data.orderId + '&payAmount=' + that.data.payAmount + '&startDate=' + that.data.startDate + '&endDate=' + that.data.endDate + '&name=' + that.data.name + '&img=' + that.data.img,
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