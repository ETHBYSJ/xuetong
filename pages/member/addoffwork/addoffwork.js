let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      studentid: "",
      img: "",
      nowdate: null,
      height: "500rpx",
      name: "",
      date: null,
      msg: "",
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
    date = year + "-" + month + "-" + day
    this.setData({
      studentid:options.studentid,
      img:options.img,
      name:options.name,
      nowdate: {year: year, month: month, day: day, fulldate: date},
      date: {year: year, month: month, day: day, fulldate: date},
      })
  }
  submit() {
    console.log("submit")    
    this.$get('/v1/attendance/askForLeaveByStudentId?studentId='+this.data.studentid+'&date='+this.data.date.fulldate).then(data => {
      console.log(data);
    }).catch(err => {
      console.log("出错");
    })   
  }
  bindDateChange(e) {
    console.log(e)
    var date = e.detail.value + ""
    var year = date.split("-")[0];
    var month = date.split("-")[1];
    var day = date.split("-")[2];
    this.setData({
      date: { year: year, month: month, day: day, fulldate: year + "-" + month + "-" + day },
    })
  }
  bindInput(e) {
    //console.log(e);
    this.setData({
      msg: e.detail.value,
    })
  }
  confirm() {
    var that = this
    wx.showModal({
      title: '确定请假',
      content: '是否确定请假？',
      success(res) {
        if(res.confirm) {
          that.submit()
        }
        else if(res.cancel) {
          console.log("用户点击取消")
        }
      }
    })
  }
  
}