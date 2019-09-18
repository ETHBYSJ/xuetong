let we = require('../../../we/index.js')


new class extends we.Page {
  data() {
    return {
      currentTab: 0,
      activitylist: [],
      keyword: "",
      page: 1,
      size: 10,
      totalsize: "", 
      address: "",
      imgBaseUrl: "",
      studentid: "",
      name: "",
      //学生头像
      img: "",
      //托管开始日期
      startDate: "",
      //托管截止日期
      endDate: "",
      //托管费每月
      price: "",
      //班级id
      clazzId: "",
      //订单号
      orderId: "",

    }
  }
  onLoad(options) {
    //console.log(options)
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    date = year + "-" + month + "-" + day
    this.setData({
      img: options.img,
      studentid: options.studentid,
      name: options.name,
      imgBaseUrl: this.$app.imgBaseUrl,
      startDate: { year: year, month: month, day: day, fulldate: date },
      endDate: { year: year, month: month, day: day, fulldate: date },
    })
    console.log(this.data.startDate)
    console.log(this.data.endDate)
  }
  onShow() {
    this.init()
    //为了获得托管班的托管费,需要先得到学生信息
    this.$get('/v1/student/getInfo?id=' + this.data.studentid).then(data => {
      console.log(data)
      this.setData({
        price: data.obj.clazz.price,
        clazzId: data.obj.clazz.id,
      })
    })
  }
  //加载默认活动列表
  init() {
    this.setData({
      page: 1,
    })
    this.$get('/v1/activity/getActivityList?page=1&size=' + this.data.size + '&keyword=' + this.data.keyword + '&address=' + this.data.address + '&status=0').then(data => {
      console.log(data)
      this.setData({
        activitylist: data.obj,
        totalsize: data.totalPage,
      })
    })
  }
  swichNav(e) {
    //console.log(e)
    let current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current,
    });
  }
  searchActivity(e) {
    //console.log(e)
    this.init()
  }
  inputKeyword(e) {
    //console.log(e)
    this.setData({
      keyword: e.detail.value,
    })
  }
  upper() {
    wx.showNavigationBarLoading()
    this.init()
    console.log("upper")
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  }
  lower(e) {
    wx.showNavigationBarLoading()
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    console.log("lower")
  }
  //继续加载效果
  nextLoad() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 4000
    })
    let page = this.data.page + 1
    if(page <= this.data.totalsize) {
      this.setData({
        page: page,
      })
      this.$get('/v1/activity/getActivityList?page=' + page + '&size=' + this.data.size + '&keyword=' + this.data.keyword + '&address=' + this.data.address + '&status=0').then(data => {
        console.log(data)
        this.setData({
          activitylist: this.data.activitylist.concat(data.obj)
        })
        setTimeout(function () {
          wx.showToast({
            title: '加载成功',
            icon: 'success',
            duration: 2000
          })
        }, 500)
      }).catch(err => {
        this.$showModal({
          title: '出错',
          content: err.msg,
          showCancel: false
        })
      })
    }    
  }
  jumpPage(e) {
    console.log(e)
    wx.navigateTo({
      url: "/pages/activity/detail/detail?id=" + e.currentTarget.dataset.id
    })
  }
  bindStartDateChange(e) {
    console.log(e)
    let date = e.detail.value + ""
    let year = date.split("-")[0];
    let month = date.split("-")[1];
    let day = date.split("-")[2];
    this.setData({
      startDate: { year: year, month: month, day: day, fulldate: year + "-" + month + "-" + day },
    })
  }
  bindEndDateChange(e) {
    console.log(e)
    let date = e.detail.value + ""
    let year = date.split("-")[0];
    let month = date.split("-")[1];
    let day = date.split("-")[2];
    this.setData({
      endDate: { year: year, month: month, day: day, fulldate: year + "-" + month + "-" + day },
    })
  }
  //支付接口
  pay() {
    console.log("pay")
    
    let po = {
      clazzId: this.data.clazzId,
      startDate: this.data.startDate.fulldate,
      endDate: this.data.endDate.fulldate,
      studentName: this.data.name,
      studentId: this.data.studentid,
      payAmount: 0.01,
      name: '家长王重阳',
    }
    console.log(po)
    this.$post('/v1/student/enroll', po).then(data => {
      console.log(data)
      po.orderId = data.obj.orderId
      let that = this
      if(data.obj) {
        wx.requestPayment({
          'timeStamp': data.obj.data.timeStamp,
          'nonceStr': data.obj.data.nonceStr,
          'package': data.obj.data.package,
          'signType': data.obj.data.signType,
          'paySign': data.obj.data.paySign,
          'success': function(res) {
            //支付成功，调用学生报名成功接口    
            console.log(po)        
            that.$post('/v1/student/enrollSucessful', po).then(data => {
              console.log(data)
              wx.switchTab({
                url: '../index/index',
              })
            })            
          },
          'fail': function (res) {
            console.log(res)
            that.$showModal({
              title: '错误',
              content: '支付失败',
              showCancel: false
            })
          },
          'complete': function (res) { },
        })
        //订单号
        this.setData({
          orderId: data.obj.orderId,
        })
      }
      else {
        that.$showModal({
          title: '错误',
          content: '报名失败',
          showCancel: false
        })
      }
    })
  }
}
