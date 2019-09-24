let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      //studentid: "",
      img: "",
      nowdate: null,
      name: "",
      //date: null,
      //msg: "",
      startDate: null,
      endDate: null,
      po: {
        studentId: '',
        startDate: '',
        endDate: '',
        content: '',
      },
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
      "po.studentId":options.studentid,
      img:options.img,
      name:options.name,
      nowDate: {year: year, month: month, day: day, fulldate: date},
      startDate: {year: year, month: month, day: day, fulldate: date},
      endDate: { year: year, month: month, day: day, fulldate: date },
      "po.startDate": date,
      "po.endDate": date,
      })
  }
  submit() {
    //console.log("submit")    
    //console.log(this.data.po)
    this.$post('/v1/askforleave/create', this.data.po).then(data => {
      //console.log(data);
      if (data.obj == 'SUCC') {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000,
        });
        setTimeout(function(){
          wx.navigateBack();
        }, 1000);
      } else {
        wx.showModal({
          title: '提示',
          content: '提交失败',
          showCancel: false,
        });
      }
    }).catch(err => {
      console.log(err);
    })   
  }
  bindStartDateChange(e) {
    console.log(e)
    var date = e.detail.value + ""
    var year = date.split("-")[0];
    var month = date.split("-")[1];
    var day = date.split("-")[2];
    this.setData({
      startDate: { year: year, month: month, day: day, fulldate: year + "-" + month + "-" + day },
      "po.startDate": year + "-" + month + "-" + day,
    })
    //防止结束日期小于开始日期
    if (this.data.endDate.fulldate < this.data.startDate.fulldate) {
      //结束日期至少要和开始日期一样大
      this.setData({
        endDate: { year: year, month: month, day: day, fulldate: year + "-" + month + "-" + day },
        "po.endDate": year + "-" + month + "-" + day,
      })
    }
  }

  bindEndDateChange(e) {
    console.log(e)
    var date = e.detail.value + ""
    var year = date.split("-")[0];
    var month = date.split("-")[1];
    var day = date.split("-")[2];
    this.setData({
      endDate: { year: year, month: month, day: day, fulldate: year + "-" + month + "-" + day },
      "po.endDate": year + "-" + month + "-" + day,
    })
  }

  bindInput(e) {
    //console.log(e);
    this.setData({
      "po.content": e.detail.value,
    })
  }
  confirm() {
    var that = this
    wx.showModal({
      title: '确定请假',
      content: '是否确定请假？',
      success(res) {
        if(res.confirm) {
          that.submit();
          
        }
        else if(res.cancel) {
          //console.log("用户点击取消")
        }
      }
    })
  }
  
}