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
      //目前可托管到的日期
      endDateLatest: "",
      //家长姓名
      parentName: "",
      //托管时间
      gradeTime: "",
      //托管地址
      gradeAddress: "",
      //应交托管费
      payAmount: "",
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
      startDate: { year: parseInt(year), month: parseInt(month), day: parseInt(day), fulldate: date },
      endDate: { year: parseInt(year), month: parseInt(month), day: parseInt(day), fulldate: date },
    })
    console.log(options)
  }
  onShow() {
    this.init()
    //为了获得托管班的托管费,需要先得到学生信息
    this.$get('/v1/student/getInfo?id=' + this.data.studentid).then(data => {
      console.log(data)
      this.setData({
        price: data.obj.clazz.price,
        clazzId: data.obj.clazz.id,
        endDateLatest: data.obj.endDate,
        gradeAddress: data.obj.clazz.grade.name,
        //parentName: data.obj.
      })
    }).catch(err => {
      this.$showModal({
        title: '出错',
        content: '获取学生信息出错',
        showCancel: false
      })
    })
    //获得当前家长用户信息
    this.$get('/v1/family/getInfo').then(data => {
      console.log(data)
      this.setData({
        parentName: data.obj.name,
      })
    }).catch(err => {
      this.$showModal({
        title: '出错',
        content: '获取家长信息出错',
        showCancel: false
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
    let year = parseInt(date.split("-")[0]);
    let month = parseInt(date.split("-")[1]);
    let day = parseInt(date.split("-")[2]);
    this.setData({
      startDate: { year: year, month: month, day: day, fulldate: year + "-" + month + "-" + day },
    })
  }
  bindEndDateChange(e) {
    console.log(e)
    let date = e.detail.value + ""
    let year = parseInt(date.split("-")[0]);
    let month = parseInt(date.split("-")[1]);
    let day = parseInt(date.split("-")[2]);
    this.setData({
      endDate: { year: year, month: month, day: day, fulldate: year + "-" + month + "-" + day },
    })
  }
  //支付接口
  pay() {
    console.log("pay")
    //为了方便计算，需要先在结束日期上加一天
    let endDateTmp = new Date(this.data.endDate.fulldate)
    let payAmount = 0
    endDateTmp.setDate(endDateTmp.getDate() + 1)
    let y = endDateTmp.getFullYear()
    let m = endDateTmp.getMonth() + 1
    let d = endDateTmp.getDate()
    endDateTmp = y + '-' + (m >= 1 && m <= 9 ? ("0" + m) : m) + '-' + (d >= 1 && d <= 9 ? ("0" + d) : d)
    endDateTmp = {year: y, month: m, day: d, fulldate: endDateTmp}
    console.log(endDateTmp)
    //计算托管费
    if(this.data.startDate.day == endDateTmp.day) {
      //托管时间为整月，计算间隔的月数     
      let monthInterval = (endDateTmp.year - this.data.startDate.year) * 12 + ( endDateTmp.month - this.data.startDate.month)
      console.log(monthInterval)
      //计算需要支付的金额
      payAmount = monthInterval * this.data.price   
      this.setData({
        gradeTime: monthInterval + "个月",
      })
    }
    else {
      //托管时间不为整月
      if(this.data.startDate.day < endDateTmp.day) {
        let monthInterval = (endDateTmp.year - this.data.startDate.year) * 12 + (endDateTmp.month - this.data.startDate.month)
        //计算多余的天数
        let dayLeft = endDateTmp.day - this.data.startDate.day
        console.log(dayLeft)
        payAmount = monthInterval * this.data.price + dayLeft * this.data.price / 22
        this.setData({
          gradeTime: monthInterval + "个月" + dayLeft + "天"
        })
      }
      else {
        //年份需要减去一年
        let endDateTmpBack = {}
        if(endDateTmp.month == 1) {
          let monthInterval = (endDateTmp.year - this.data.startDate.year) * 12 + (endDateTmp.month - this.data.startDate.month - 1)
          console.log(monthInterval)
          endDateTmpBack = {year: endDateTmp.year - 1, month: 12, day: this.data.startDate.day}
          endDateTmpBack.fulldate = "" + endDateTmpBack.year + "-" + endDateTmpBack.month + "-" + ((endDateTmpBack.day >= 1 && endDateTmpBack.day <= 9) ? "0" + endDateTmpBack.day : endDateTmpBack.day)
          console.log(endDateTmpBack)
          //计算时间差
          let dayLeft = parseInt((new Date(endDateTmp.fulldate).getTime() - new Date(endDateTmpBack.fulldate).getTime()) / (1000 * 60 * 60 * 24))
          console.log(dayLeft)
          payAmount = monthInterval * this.data.price + dayLeft * this.data.price / 22
          this.setData({
            gradeTime: monthInterval + "个月" + dayLeft + "天"
          })
        }
        else {
          let monthInterval = (endDateTmp.year - this.data.startDate.year) * 12 + (endDateTmp.month - this.data.startDate.month - 1)
          console.log(monthInterval)
          endDateTmpBack = {year: endDateTmp.year, month: endDateTmp.month - 1, day: this.data.startDate.day}
          endDateTmpBack.fulldate = "" + endDateTmpBack.year + "-" + ((endDateTmpBack.month >= 1 && endDateTmpBack.month <= 9) ? "0" + endDateTmpBack.month : endDateTmpBack.month) + "-" + ((endDateTmpBack.day >= 1 && endDateTmpBack.day <= 9) ? "0" + endDateTmpBack.day : endDateTmpBack.day)
          console.log(endDateTmpBack)
          let dayLeft = parseInt((new Date(endDateTmp.fulldate).getTime() - new Date(endDateTmpBack.fulldate).getTime()) / (1000 * 60 * 60 * 24))
          console.log(dayLeft)
          payAmount = monthInterval * this.data.price + dayLeft * this.data.price / 22
          this.setData({
            gradeTime: monthInterval + "个月" + dayLeft + "天"
          })
        }
      }
    }
    this.setData({
      payAmount: payAmount.toFixed(2),
    })
    console.log(payAmount)
    let po = {
      clazzId: this.data.clazzId,
      startDate: this.data.startDate.fulldate,
      endDate: this.data.endDate.fulldate,
      studentName: this.data.name,
      studentId: this.data.studentid,
      //测试
      payAmount: 0.01,
      name: this.data.parentName,
    }
    console.log(po)
    this.$post('/v1/student/enroll', po).then(data => {
      console.log(data)
      po.orderId = data.obj.orderId      
      let that = this
      if(data.obj) {
        //订单号
        this.setData({
          orderId: data.obj.orderId,
        })
        /*
        wx.navigateTo({
          url: './success/success?gradeAddress=' + that.data.gradeAddress + '&gradeTime=' + that.data.gradeTime + '&orderId=' + that.data.orderId + '&payAmount=' + that.data.payAmount + '&startDate=' + that.data.startDate.fulldate + '&endDate=' + that.data.endDate.fulldate + '&name=' + that.data.name + '&img=' + that.data.img,
        })
        */
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
              wx.navigateTo({
                url: './success/success?gradeAddress=' + that.data.gradeAddress + '&gradeTime=' + that.data.gradeTime + '&orderId=' + that.data.orderId + '&payAmount=' + that.data.payAmount + '&startDate=' + that.data.startDate.fulldate + '&endDate=' + that.data.endDate.fulldate + '&name=' + that.data.name + '&img=' + that.data.img,
              })
              /*
              wx.switchTab({
                url: '../index/index',
              })
              */
            }).catch(err => {
              this.$showModal({
                title: '出错',
                content: '调用接口出错',
                showCancel: false
              })
            })            
          },
          'fail': function (res) {
            console.log(res)
            /*
            that.$showModal({
              title: '错误',
              content: '支付失败',
              showCancel: false
            })
            */
            //支付失败,跳转到失败页面
            wx.navigateTo({
              url: './fail/fail',
            })
          },
          'complete': function (res) { },
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
  //咨询电话
  consult() {
    console.log("consult")
    /*
    wx.navigateTo({
      url: './fail/fail',
    })
    */
  }
}
