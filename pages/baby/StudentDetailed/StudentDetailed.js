let we = require('../../../we/index.js')


new class extends we.Page {
  data() {
    return {
      currentTab: 1,
      attend: [],
      //每页数据量(考勤)
      attendsize: 4,
      homeworktoday: null,
      homeworkrest: [],
      //每页数据量(作业)
      homeworksize: 2,
      name: "",
      studentid: "",
      index: "",
      totalattendsize: "",
      totalhomeworksize: "",
      attendpage: "",
      homeworkpage: "",
      //今天作业是否上传
      uploadtoday: false,
      nowday: "",
    }
  }
  onLoad(options) {
    this.setData({
      name: options.name,
      studentid: options.studentid,
    })
  }
  onShow() {
    //获得当前日期
    var today = new Date()
    var year = today.getFullYear()
    var month = today.getMonth() + 1
    if (month >= 1 && month <= 9) {
      month = "0" + month
    }
    var day = today.getDate()
    if (day >= 0 && day <= 9) {
      day = "0" + day
    }
    today = year + "-" + month + "-" + day
    this.setData({
      nowday: today,
    })
    //考勤数据
    this.getAttend()
    //作业数据
    this.getHomework()
  }
  //考勤数据
  getAttend() {
    this.$get('/v1/attendance/getStudentAttendanceEverydayList?page=1&size=' + this.data.attendsize).then(data => {
      console.log(data)
      if (this.data.index == "") {
        for (var i = 0; i < data.obj.length; i++) {
          if (this.data.studentid == data.obj[i].id) {
            this.setData({
              index: i,
            })
            break
          }
        }
      }
      this.setData({
        attendpage: 1,
        attend: data.obj[this.data.index].studentEverydayAttendanceVOList,
        //feed: temp,
        totalattendsize: data.obj[this.data.index].totalPage,
      })
    })
  }

  //作业数据
  getHomework() {
    /*
    this.$get('/v1/attendance/getTeacherAttendanceEverydayList?page=1&size=4&clazzid=4').then(data => {
      console.log(data)
    })
    */
    this.$get('/v1/homework/getList?page=1&size=' + this.data.homeworksize + '&id=' + this.data.studentid).then(data => {
      console.log(data)
      //console.log(data.obj)
      //检查今日是否上传
      this.setData({
        homeworkpage: 1,
      })
      if (data.obj.length > 0 && data.obj[0].homeworkDate == this.data.nowday) {
        //今日作业已经上传
        this.setData({
          uploadtoday: true,
          homeworktoday: data.obj.shift(),
          homeworkrest: data.obj,
        })
      }
      else {
        //今日未上传作业
        this.setData({
          uploadtoday: false,
          homeworkrest: data.obj,
          homeworktoday: null,
        })
      }
      console.log(this.data.homeworkrest)
      console.log(this.data.homeworktoday)      
    })
  }

  upper() {
    wx.showNavigationBarLoading()
    if(this.data.currentTab == 1) {
      this.getHomework()
    }
    else {
      //this.data.currentTab == 0
      this.getAttend()
    }
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
    if(this.data.currentTab == 1) {
      console.log("...")
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 4000
      })
      var homeworkpage = this.data.homeworkpage + 1
      console.log(homeworkpage)
      this.$get('/v1/homework/getList?page=' + homeworkpage + '&size=' + this.data.homeworksize + '&id=' + this.data.studentid).then(data => {
        if (data.obj.length > 0) {
          this.setData({
            homeworkpage: homeworkpage,
          })          
          this.setData({
            homeworkrest: this.data.homeworkrest.concat(data.obj)
          })
          console.log(this.data.homework)
          setTimeout(function () {
            wx.showToast({
              title: '加载成功',
              icon: 'success',
              duration: 2000
            })
          }, 500)
        }
      })
    }
    else {
      //this.data.currentTab == 0
      if (this.data.attendpage != this.data.totalattendsize) {
        console.log("...")
        wx.showToast({
          title: '加载中',
          icon: 'loading',
          duration: 4000
        })
        var attendpage = this.data.attendpage + 1;
        console.log(attendpage);
        this.setData({
          attendpage: attendpage,
        })
        this.$get('/v1/attendance/getStudentAttendanceEverydayList?page=' + this.data.attendpage + '&size=' + this.data.attendsize).then(data => {
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
            attend: this.data.attend.concat(data.obj[this.data.index].studentEverydayAttendanceVOList)
          })
          console.log(this.data.attend)
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

  swichNav(e) {
    var current = e.currentTarget.dataset.current;
    console.log(current)
    this.setData({
      currentTab: current,
    });
  }
}