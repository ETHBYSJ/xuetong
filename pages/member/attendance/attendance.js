let we = require('../../../we/index.js')
var util = require('../../../utils/utilb.js')


new class extends we.Page {
  data() {
    return {
      feed: [],
      page: 1,
      totalsize: "",
      size: 10,
      index:0,
      studentid: "",
      clazzid:"",
      userType:""
    }
  }
  //滑动页面处理函数
  onSlideChangeEnd(e){
    this.setData({
      index: e.detail.current,
      studentid: this.data.feed[e.detail.current].id,
      clazzid: this.data.feed[e.detail.current].clazzid,
      page: 1,
    })
    if (this.$app.userType == '教职工') {
      this.gettechData();
    } else {
      //调用应用实例的方法获取全局数据
      this.getData();
    }
    
  }

  //事件处理函数
  bindItemTap(e) {
      wx.navigateTo({
        url: '../../answerb/answerb'
      })
  }
  onLoad(){
    this.setData({
      'vo.imgBaseUrl': this.$app.imgBaseUrl,
      userType: this.$app.userType,
    })  

  }
  onShow() {
    if (this.$app.userType == '教职工') {
      this.gettechData();
    } else {
      //调用应用实例的方法获取全局数据
      this.getData();
    }
   
  }
  upper() {
    wx.showNavigationBarLoading()
    if (this.$app.userType == '教职工') {
      this.gettechData();
    } else {
      //调用应用实例的方法获取全局数据
      this.getData();
    }
    console.log("upper");
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  }
  lower(e) {
    wx.showNavigationBarLoading();
    var that = this;
    if (this.$app.userType == '教职工') {
      setTimeout(function () { wx.hideNavigationBarLoading(); that.nexttechLoad(); }, 1000);
    } else {
      setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    }
    console.log("lower")
  }

  //使用本地 fake 数据实现刷新效果
  getData() {
    this.$get('/v1/attendance/getStudentAttendanceEverydayList?page=1&size=' + this.data.size).then(data => {
     
      this.setData({
        feed: data.obj,
        studentid: data.obj[this.data.index].id,
        totalsize: data.obj[this.data.index].totalPage,
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }

  //使用本地 fake 数据实现刷新效果
  gettechData() {
    this.$get('/v1/attendance/getTeacherAttendanceEverydayList?page=1&size=' + this.data.size).then(data => {
      console.log(data.obj)
      this.setData({
        feed: data.obj,
        clazzid: data.obj[this.data.index].clazzid,
        totalsize: data.obj[this.data.index].totalPage,
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
 
  //使用本地 fake 数据实现继续加载效果
  nextLoad() {
    if (this.data.page != this.data.totalsize) {
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
      this.$get('/v1/attendance/getStudentAttendanceEverydayList?page='+page+'&size='+this.data.size).then(data => {
        let index=this.data.index;
        this.setData({
          [`feed[${index}].studentEverydayAttendanceVOList`]: data.obj[this.data.index].studentEverydayAttendanceVOList,
          [`feed[${index}].studentEverydayAttendanceVOList`]: this.data.feed[this.data.index].studentEverydayAttendanceVOList.concat(data.obj[this.data.index].studentEverydayAttendanceVOList),
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



  //使用本地 fake 数据实现继续加载效果
  nexttechLoad() {
    if (this.data.page != this.data.totalsize) {
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
      this.$get('/v1/attendance/getTeacherAttendanceEverydayList?page=' + page + '&size=' + this.data.size).then(data => {
        let index = this.data.index;
        this.setData({
          [`feed[${index}].teacherEverydayAttendanceVOList`]: data.obj[this.data.index].teacherEverydayAttendanceVOList,
          [`feed[${index}].teacherEverydayAttendanceVOList`]: this.data.feed[this.data.index].teacherEverydayAttendanceVOList.concat(data.obj[this.data.index].teacherEverydayAttendanceVOList),
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




}