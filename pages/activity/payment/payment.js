let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      imgBaseUrl: "",
      //订单id
      orderId: "",
      //订单号
      orderSn: "",
      //参加活动的学生列表
      studentList: [],
      //参加活动的家长列表
      familyList: [],
      //电话号码
      familyPhone: "",
      //标题照片
      titlePhoto: "",
      //标题
      heading: "",
      //学生每人价格
      studentPrice: 0,
      //家长每人价格
      familyPrice: 0,
      //剩余名额
      remains: 0,
      //活动状态: 0报名中,1已结束
      status: 0,
      //是否有家长参与: 0允许,1不允许
      familyEnable: "",
      //活动报名费
      payAmount: 0,
      //活动id
      id: "",
      phone: "",
    }
  }
  onLoad(options) {
    this.setData({
      orderId: options.id,
      imgBaseUrl: this.$app.imgBaseUrl,
    })
  }
  onShow() {
    console.log(this.data.orderId)
    this.$get('/v1/order/' + this.data.orderId).then(data => {
      console.log(data);
      this.setData({
        id: data.obj.obj.activity.id,
        phone: data.obj.obj.activity.phone,
      });
      if (data.obj.obj.activityStudentList && data.obj.obj.activityStudentList.length > 2) {
        this.setData({
          studentList: data.obj.obj.activityStudentList.slice(2, -2).split('\",\"'),
        })
      }
      if (data.obj.obj.activityFamilyList && data.obj.obj.activityFamilyList.length > 2) {
        this.setData({
          familyList: data.obj.obj.activityFamilyList.slice(2, -2).split('\",\"'),
        })
      }
      this.setData({
        //订单号
        orderSn: data.obj.order.orderSn,
        //家庭电话号码
        familyPhone: data.obj.obj.familyPhone,
        //标题照片
        titlePhoto: this.data.imgBaseUrl + data.obj.obj.activity.titlePhoto,
        //标题
        heading: data.obj.obj.activity.heading,
        //学生每人价格
        studentPrice: data.obj.obj.activity.studentPrice,
        //家长每人价格
        familyPrice: data.obj.obj.activity.familyPrice,
        //剩余名额
        remains: data.obj.obj.activity.remains,
        //活动状态: 0报名中,1已结束
        status: data.obj.obj.activity.status,
        //是否有家长参与: 0允许,1不允许
        familyEnable: data.obj.obj.activity.familyEnable,
        //活动报名费
        payAmount: data.obj.order.payAmount,
      })
    })
  }
  consult() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
    })
  }
  //返回首页
  toIndex() {
    wx.switchTab({
      url: '/pages/activity/index/index',
    })
  }
  jumpPage() {
    let that = this
    wx.navigateTo({
      url: '../detailAfterPay/detailAfterPay?id=' + that.data.id,
    })
  }
}