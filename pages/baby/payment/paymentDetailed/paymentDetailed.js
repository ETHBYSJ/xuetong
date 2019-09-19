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
    let endDate = options.endDate
    let startDate = options.startDate
    this.setData({
      gradeAddress: options.gradeAddress,
      gradeTime: options.gradeTime,
      orderId: options.orderId,
      payAmount: options.payAmount,
      name: options.name,
      startDate: {year: startDate.substr(0, 4), month: startDate.substr(5, 2), day: startDate.substr(8, 2), fulldate: startDate},
      endDate: {year: endDate.substr(0, 4), month: endDate.substr(5, 2), day: endDate.substr(8, 2), fulldate: endDate},
      img: options.img,
    })
  }
  contact() {

  }
  //返回首页
  toIndex() {
    console.log("toIndex")
    wx.switchTab({
      url: '/pages/activity/index/index',
    })
  }
}