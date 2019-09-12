let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      studentid: "",
      page: 1,
      totalsize: "",
      size: 4,
      feed: [],
      index: "",
      name: "",
      img: "",
    }
  }
  onLoad(options) {
    console.log(options.studentid)
    this.setData({
      studentid: options.studentid,
      img: options.img,
    })
  }
  onShow() {
    this.getData()
  }
  getData() {
    this.$get('/v1/attendance/getStudentAttendanceEverydayList?page=1&size=' + this.data.size).then(data => {
      //console.log(data)      
      if(this.data.index == "") {
        for (var i = 0; i < data.obj.length; i++) {
          if(this.data.studentid == data.obj[i].id) {
            this.setData({
              index: i,
            })
            break
          }
        }
      }
      if(this.data.name == "") {
        this.setData({
          name: data.obj[this.data.index].name
        })
      }
      /*
      var temp = []
      for (var i = 0; i < data.obj[this.data.index].studentEverydayAttendanceVOList.length; i++) {
        if (data.obj[this.data.index].studentEverydayAttendanceVOList[i].attendanceStudentList[0].type == 0) {
          temp.push(data.obj[this.data.index].studentEverydayAttendanceVOList[i])
        }
      }
      console.log(temp)
      */
      this.setData({
        page: 1,
        feed: data.obj[this.data.index].studentEverydayAttendanceVOList,
        //feed: temp,
        totalsize: data.obj[this.data.index].totalPage,
      })
      console.log(this.data.feed)
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
    if(this.data.page != this.data.totalsize) {
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
      this.$get('/v1/attendance/getStudentAttendanceEverydayList?page=' + this.data.page + '&size=' + this.data.size).then(data => {
        console.log(data)
        /*
        var next = []
        for (var i = 0; i < data.obj[this.data.index].studentEverydayAttendanceVOList.length; i++) {
          if (data.obj[this.data.index].studentEverydayAttendanceVOList[i].attendanceStudentList[0].type == 0) {
            next.push(data.obj[this.data.index].studentEverydayAttendanceVOList[i])
          }
        }
        */
        this.setData({
          //feed: this.data.feed.concat(next)
          feed: this.data.feed.concat(data.obj[this.data.index].studentEverydayAttendanceVOList)
        })
        console.log(this.data.feed)
      }).catch(err => {
          this.$showModal({
          title: '获取信息错误',
          content: err.msg,
          showCancel: false
        })
      })
    }
  }
}