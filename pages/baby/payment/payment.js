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
  }
  onShow() {
    this.init()
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
}
