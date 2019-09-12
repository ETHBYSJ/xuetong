let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      clazzid: "",
      name: "",
      img: "",
      page: 1,
      totalsize: "",
      size: 4,
      feed: [],      
    }
  }
  onLoad(options) {
    //console.log(options.clazzid)
    this.setData({
      clazzid: options.clazzid,
    })
  }
  onShow() {
    this.getData()
  }
  getData() {
    this.$get('/v1/attendance/getTeacherAttendanceEverydayList?clazzid='+this.data.clazzid+'&page=1&size=' + this.data.size).then(data => {
      console.log(data)
      /*
      for(var i = 0; i < data.obj.length; i++) {
        if(data.obj[i].clazzid == this.data.clazzid) {
          this.setData({
            index: i,
          })
          console.log(this.data.index)
          break
        }
      }
      */
      if (this.data.name == "") {
        this.setData({
          name: data.obj[0].name,
        })
      }
      if (this.data.img == "") {
        this.setData({
          img: data.obj[0].photo,
        })
      }
      this.setData({
        page: 1,
        feed: data.obj[0].teacherEverydayAttendanceVOList,
        totalsize: data.obj[0].totalPage,
      })
    }).catch(err => {
      this.$showModal({
        title: '出错',
        content: err.msg,
        showCancel: false
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
    if (this.data.page <= this.data.totalsize) {
      console.log("...")
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
      this.$get('/v1/attendance/getTeacherAttendanceEverydayList?clazzid=' + this.data.clazzid + '&page=' + this.data.page + '&size=' + this.data.size ).then(data => {
        console.log(data)
        this.setData({
          feed: this.data.feed.concat(data.obj[0].teacherEverydayAttendanceVOList)
        })
        console.log(this.data.feed)
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
}