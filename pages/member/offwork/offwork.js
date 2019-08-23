//请假 页面
let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      studentid: "",
      record: [],
      img: '',
      name: "",
      feed: [],
      page: 1,
      totalsize: "",
      size: 4,
      hiddenScrollTop: true,
    }
  }
  onLoad(options) {
    console.log(options)
    this.setData({
      studentid: options.studentid,
      img: options.img,
      name: options.name,
    })
  }
  onShow() {
    this.getData()
  }
  getData() {
    this.$get('/v1/attendance/getStudentAttendanceById?studentid=' + this.data.studentid + '&page=1&size=' + this.data.size).then(data => {
      console.log(data)
      this.setData({
        totalsize: Math.ceil(data.totalSize / this.data.size)
      })
      //console.log(this.data.totalsize)
      var temp = []
      for(var i = 0; i < data.obj.length; i++) {
        if(data.obj[i].type == 2) {
          var recorddate = data.obj[i].recorddate.split("-")
          data.obj[i].year = recorddate[0]
          data.obj[i].month = recorddate[1]
          data.obj[i].day = recorddate[2].substr(0, 2)
          temp.push(data.obj[i])
        }
      }
      console.log(temp)
      this.setData({
        page: 1,
        feed: temp,
      })
    })
  }
  upper() {
    wx.showNavigationBarLoading()
    this.getData()
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
    if(this.data.page != this.data.totalsize) {
      console.log('...')
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 4000
      })
      var page = this.data.page + 1;
      console.log(page);
      this.setData({
        page: page,
      })
      this.$get('/v1/attendance/getStudentAttendanceById?studentid=' + this.data.studentid + '&page=' + this.data.page + '&size=' + this.data.size).then(data => {
        console.log(data)
        var next = []
        for (var i = 0; i < data.obj.length; i++) {
          if (data.obj[i].type == 2) {
            var nextrecorddate = data.obj[i].recorddate.split("-")
            data.obj[i].year = nextrecorddate[0]
            data.obj[i].month = nextrecorddate[1]
            data.obj[i].day = nextrecorddate[2].substr(0, 2)
            next.push(data.obj[i])
          }
        }
        console.log(next)
        this.setData({
          feed: this.data.feed.concat(next),
        })
      }).catch(err => {
        this.$showModal({
          title: '获取信息错误',
          content: err.msg,
          showCancel: false
        })
      })
      setTimeout(function () {
        wx.showToast({
          title: '加载成功',
          icon: 'success',
          duration: 2000
        })
      }, 500)
    }
  }

  bindScroll(e) {
    //console.log(e)
    if(e.detail.scrollTop > 100) {
      this.setData({
        hiddenScrollTop: false,
      })
    } 
    else {
      this.setData({
        hiddenScrollTop: true,
      })
    }
  }
  scrollTop() {
    //console.log("scrollTop")
    this.setData({
      scrolltop: 0,
    })   
  }
}