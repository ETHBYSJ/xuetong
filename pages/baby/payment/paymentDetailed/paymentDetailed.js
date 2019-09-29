let we = require('../../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      //托管地址
      gradeAddress: "",
      //托管时间
      gradeTime: "",
      //订单id
      orderId: "",
      //订单号
      orderSn: "",
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
      imgBaseUrl: "",
    }
  }
  onLoad(options) {
    console.log(options)
    this.setData({
      orderId: options.id,
      imgBaseUrl: this.$app.imgBaseUrl,
    })
    /*
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
    */
  }
  onShow() {
    this.$get('/v1/order/' + this.data.orderId).then(data => {
      console.log(data)
      let startDate = data.obj.obj.student.startDate
      let endDate = data.obj.obj.student.endDate
      this.setData({
        name: data.obj.obj.student.name,
        img: this.data.imgBaseUrl + data.obj.obj.student.photo,
        startDate: { year: startDate.substr(0, 4), month: startDate.substr(5, 2), day: startDate.substr(8, 2), fulldate: startDate },
        endDate: { year: endDate.substr(0, 4), month: endDate.substr(5, 2), day: endDate.substr(8, 2), fulldate: endDate },
        gradeAddress: data.obj.obj.student.clazz.grade.name,
        orderSn: data.obj.order.orderSn,
        payAmount: data.obj.order.payAmount,
        gradeTime: data.obj.obj.student.days,
        phone: data.obj.obj.student.clazz.grade.phone,
      });
    }).catch(err => {
      this.$showModal({
        title: '出错',
        content: '获得订单信息出错',
        showCancel: false
      })
    })
  }
  contact() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
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