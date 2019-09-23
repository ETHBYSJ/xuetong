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
      startDate: {},
      //托管截止日期
      endDate: {},
      //托管费每月
      price: "",
      //班级id
      clazzId: "",
      //订单id
      orderId: "",
      //目前可托管到的日期
      endDateLatest: "",
      //家长姓名
      parentName: "",
      //托管时间
      gradeTime: '未设置',
      //托管地址
      gradeAddress: "",
      //应交托管费
      payAmount: 0,
      //最小结束日期
      smallestEndDate: {},
      location: "",
    }
  }
  onLoad(options) {
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
    date = year + "-" + month + "-" + day;
    this.setData({
      img: options.img,
      studentid: options.studentid,
      name: options.name,
      imgBaseUrl: this.$app.imgBaseUrl,
      startDate: { year: year, month: month, day: day, fulldate: date },
    })
    this.getEndDate()
  }
  //将开始日期推移一个月之后的结束日期
  getEndDate() {
    let year = this.data.startDate.year
    let month = this.data.startDate.month
    //计算一个月之后的日期
    let num = this.getDayNum(parseInt(year), parseInt(month))
    let tmpfulldate = this.getDateAfter(this.data.startDate.fulldate, num)
    //结束日期等于一个月后的日期减去一天
    let endDateTmp = new Date(tmpfulldate)
    endDateTmp.setDate(endDateTmp.getDate() - 1)
    let ey = endDateTmp.getFullYear()
    let em = endDateTmp.getMonth() + 1
    let ed = endDateTmp.getDate()
    endDateTmp = ey + '-' + (em >= 1 && em <= 9 ? ("0" + em) : em) + '-' + (ed >= 1 && ed <= 9 ? ("0" + ed) : ed)
    this.setData({
      endDate: {year: ey, month: em, day: ed, fulldate: endDateTmp},
      smallestEndDate: { year: ey, month: em, day: ed, fulldate: endDateTmp },
    })
  }
  onShow() {
    this.init()
    //为了获得托管班的托管费,需要先得到学生信息
    this.$get('/v1/student/getInfo?id=' + this.data.studentid).then(data => {
      this.setData({
        price: data.obj.clazz.price,
        clazzId: data.obj.clazz.id,
        endDateLatest: data.obj.endDate,
        gradeAddress: data.obj.clazz.grade.name,
        location: this.$app.CurrentcityLink,
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
      this.setData({
        activitylist: data.obj,
        totalsize: data.totalPage,
      })
    })
  }
  swichNav(e) {
    let current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current,
    });
  }
  searchActivity(e) {
    this.init()
  }
  inputKeyword(e) {
    this.setData({
      keyword: e.detail.value,
    })
  }
  upper() {
    wx.showNavigationBarLoading()
    this.init()
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  }
  lower(e) {
    wx.showNavigationBarLoading()
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
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
    wx.navigateTo({
      url: "/pages/activity/detail/detail?id=" + e.currentTarget.dataset.id
    })
  }
  //计算托管费
  getAmount() {
    let payAmount = 0
    let startDate = this.data.startDate
    let tmpy = parseInt(startDate.year)
    let tmpm = parseInt(startDate.month)
    let tmpd = parseInt(startDate.day)
    let tmpfulldate = tmpy + '-' + (tmpm >= 1 && tmpm <= 9 ? ("0" + tmpm) : tmpm) + '-' + (tmpd >= 1 && tmpd <= 9 ? ("0" + tmpd) : tmpd)
    let prefulldate = tmpfulldate
    //为了方便计算,结束日期加一天
    let endDateTmp = new Date(this.data.endDate.fulldate)
    endDateTmp.setDate(endDateTmp.getDate() + 1)
    let ey = endDateTmp.getFullYear()
    let em = endDateTmp.getMonth() + 1
    let ed = endDateTmp.getDate()
    endDateTmp = ey + '-' + (em >= 1 && em <= 9 ? ("0" + em) : em) + '-' + (ed >= 1 && ed <= 9 ? ("0" + ed) : ed)
    endDateTmp = { year: ey, month: em, day: ed, fulldate: endDateTmp }
    //当前循环到的年月
    let cy = tmpy
    let cm = tmpm
    //托管整月数和天数
    let monthCount = 0
    let dayCount = 0
    while(endDateTmp.fulldate >= tmpfulldate) {
      prefulldate = tmpfulldate
      let num = this.getDayNum(cy, cm)
      tmpfulldate = this.getDateAfter(tmpfulldate, num)
      //当前年月递增
      if(cm == 12) {
        cm = 1
        cy += 1
      }
      else {
        cm += 1
      }
      if (endDateTmp.fulldate >= tmpfulldate) {
        monthCount += 1
      }
      else break
    }
    //计算剩余天数
    dayCount = (parseInt(new Date(endDateTmp.fulldate).getTime() - new Date(prefulldate).getTime())) / (1000 * 60 * 60 * 24)
    //计算总托管费用
    payAmount = monthCount * this.data.price + dayCount * this.data.price / 22
    this.setData({
      payAmount: payAmount.toFixed(2),
    })
    if(dayCount != 0) {
      this.setData({
        gradeTime: monthCount + "个月" + dayCount + "天",
      })
    }
    else {
      this.setData({
        gradeTime: monthCount + "个月",
      })
    }
  }
  //获得某年某月的天数
  getDayNum(year, month) {
    return new Date(year, month, 0).getDate()
  }
  //获得某年某月某天向后推多少天后的日期
  getDateAfter(fulldate, num) {
    let tmp = new Date(fulldate)
    tmp.setDate(tmp.getDate() + num)
    let y = tmp.getFullYear()
    let m = tmp.getMonth() + 1
    let d = tmp.getDate()
    fulldate = y + '-' + (m >= 1 && m <= 9 ? ("0" + m) : m) + '-' + (d >= 1 && d <= 9 ? ("0" + d) : d)
    //return {year: y, month: m, day: d, fulldate: fulldate}
    return fulldate
  }
  bindStartDateChange(e) {
    let date = e.detail.value + ""
    let year = date.split("-")[0]
    let month = date.split("-")[1]
    let day = date.split("-")[2]
    this.setData({
      startDate: { year: year, month: month, day: day, fulldate: year + "-" + month + "-" + day },
    })
    this.getEndDate()
    this.getAmount()
  }
  bindEndDateChange(e) {
    let date = e.detail.value + ""
    let year = date.split("-")[0]
    let month = date.split("-")[1]
    let day = date.split("-")[2]
    this.setData({
      endDate: { year: year, month: month, day: day, fulldate: year + "-" + month + "-" + day },
    })
    this.getAmount()
  }
  //支付接口
  pay() {
    let po = {
      clazzId: this.data.clazzId,
      startDate: this.data.startDate.fulldate,
      endDate: this.data.endDate.fulldate,
      studentName: this.data.name,
      studentId: this.data.studentid,
      days: this.data.gradeTime,
      //测试时改为0.01
      payAmount: this.data.payAmount, //0.01
      name: this.data.parentName,
    }
    this.$post('/v1/student/enroll', po).then(data => {
      po.orderId = data.obj.orderId      
      let that = this
      if(data.obj) {
        //订单号
        this.setData({
          orderId: data.obj.orderId,
        })      
        wx.requestPayment({
          'timeStamp': data.obj.data.timeStamp,
          'nonceStr': data.obj.data.nonceStr,
          'package': data.obj.data.package,
          'signType': data.obj.data.signType,
          'paySign': data.obj.data.paySign,
          'success': function(res) {
            //支付成功，调用学生报名成功接口         
            that.$post('/v1/student/enrollSucessful', po).then(data => {
              wx.navigateTo({
                url: './success/success?id=' + that.data.orderId,
              })
            }).catch(err => {
              this.$showModal({
                title: '出错',
                content: '调用接口出错',
                showCancel: false
              })
            })            
          },
          'fail': function (res) {
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

  }
}
