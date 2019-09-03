let we = require('../../../we/index.js')


new class extends we.Page {
  data() {
    return {
      imgBaseUrl: "",
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
      //是否已提交反馈
      submit: false,
      //教师反馈
      po: {
        chineseFeedback: "",
        chineseStatus: 0,
        mathFeedback: "",
        mathStatus: 0,
        englishFeedback: "",
        englishStatus: 0,
        otherFeedback: "",
        otherStatus: 0,
        homeworkDate: "", 
        studentId: "",             
      },
      
      Items: [
        {
          name: "语文",
          radioItem: [
            { value: "已完成", checked: false, id: 2 },
            { value: "未完成", checked: false, id: 1 },
            { value: "无作业", checked: false, id: 0 },
          ],
          index: 0, 
          pick: "",
          feedback: "",
          value: "chinese",
        },
        
        {
          name: "数学",
          radioItem: [
            { value: "已完成", checked: false, id: 2 },
            { value: "未完成", checked: false, id: 1 },
            { value: "无作业", checked: false, id: 0 },
          ],
          index: 1,
          pick: "",
          feedback: "",
          value: "math",
        },
        {
          name: "英语",
          radioItem: [
            { value: "已完成", checked: false, id: 2 },
            { value: "未完成", checked: false, id: 1 },
            { value: "无作业", checked: false, id: 0 },
          ],
          index: 2,
          pick: "",
          feedback: "",
          value: "english",
        },
        {
          name: "其它",
          radioItem: [
            { value: "已完成", checked: false, id: 2 },
            { value: "未完成", checked: false, id: 1 },
            { value: "无作业", checked: false, id: 0 },
          ],
          index: 3,
          pick: "",
          feedback: "",
          value: "other",
        },        
      ]
    }
  }
  onLoad(options) {
    this.setData({
      name: options.name,
      studentid: options.studentid,
      "po.studentId": options.studentid,
      imgBaseUrl: this.$app.imgBaseUrl,
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
      "po.homeworkDate": today,
    })
    //考勤数据
    this.getAttend()
    //作业数据
    this.getHomework()
  }
  //考勤数据
  getAttend() {
    this.$get('/v1/attendance/getListByStudentId?page=1&size=' + this.data.attendsize + '&id=' + this.data.studentid).then(data => {
      console.log(data)     
      if(data.obj != null) {
        this.setData({
          attendpage: 1,
          attend: data.obj.studentEverydayAttendanceVOList,
          totalattendsize: data.totalPage,
        })
      }
      else {
        this.setData({
          attendpage: 1,
          attend: data.obj.studentEverydayAttendanceVOList,
          totalattendsize: data.totalPage,
        })
      }     
    }).catch(err => {
      this.$showModal({
        title: '出错',
        content: err.msg,
        showCancel: false
      })
    })
  }

  //作业数据
  getHomework() {
    this.$get('/v1/homework/getList?page=1&size=' + this.data.homeworksize + '&id=' + this.data.studentid).then(data => {
      console.log(data)
      //console.log(data.obj)
      //检查今日是否上传
      this.setData({
        homeworkpage: 1,
      })
      if (data.obj.length > 0 && data.obj[0].homeworkDate == this.data.nowday) {
        //console.log(data.obj)
        //今日作业已经上传
        this.setData({
          uploadtoday: true,
          homeworktoday: data.obj.shift(),
          homeworkrest: data.obj,
        })
        //
        if(this.data.homeworktoday.status != 3) {
          //载入反馈信息
          let homeworktoday = this.data.homeworktoday
          this.setData({
            "Items[0].pick": homeworktoday.chineseStatus,
            [`Items[0].radioItem[${homeworktoday.chineseStatus}].checked`]: true,
            "Items[0].feedback": homeworktoday.chineseFeedback,
            "Items[1].pick": homeworktoday.mathStatus,
            [`Items[1].radioItem[${homeworktoday.mathStatus}].checked`]: true,
            "Items[1].feedback": homeworktoday.mathFeedback,
            "Items[2].pick": homeworktoday.englishStatus,
            [`Items[2].radioItem[${homeworktoday.englishStatus}].checked`]: true,
            "Items[2].feedback": homeworktoday.englishFeedback,
            "Items[3].pick": homeworktoday.otherStatus,
            [`Items[3].radioItem[${homeworktoday.otherStatus}].checked`]: true,
            "Items[3].feedback": homeworktoday.otherFeedback,
          })
          console.log(this.data.Items)
        }
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
      }).catch(err => {
        this.$showModal({
          title: '出错',
          content: err.msg,
          showCancel: false
        })
      })
    }
    else {
      //this.data.currentTab == 0
      if (this.data.attendpage <= this.data.totalattendsize) {
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
        this.$get('/v1/attendance/getListByStudentId?page=' + this.data.attendpage + '&size=' + this.data.attendsize + '&id=' + this.data.studentid).then(data => {
          console.log(data)         
          this.setData({
            //feed: this.data.feed.concat(next)
            attend: this.data.attend.concat(data.obj.studentEverydayAttendanceVOList)
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
  radioChange(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    if(e.detail.value == "已完成") {
      this.setData({
        [`Items[${index}].radioItem[0].checked`]: true,
        [`Items[${index}].radioItem[1].checked`]: false,
        [`Items[${index}].radioItem[2].checked`]: false,
        [`Items[${index}].pick`]: 0,
      })      
    }
    else if(e.detail.value == "未完成") {
      this.setData({
        [`Items[${index}].radioItem[1].checked`]: true,
        [`Items[${index}].radioItem[0].checked`]: false,
        [`Items[${index}].radioItem[2].checked`]: false,
        [`Items[${index}].pick`]: 1,
      }) 
    }
    else {
      //无作业
      this.setData({
        [`Items[${index}].radioItem[2].checked`]: true,
        [`Items[${index}].radioItem[0].checked`]: false,
        [`Items[${index}].radioItem[1].checked`]: false,
        [`Items[${index}].pick`]: 2,
      }) 
    }
    console.log(this.data.Items)
  }
  feedback() {    
    let that = this
    wx.showModal({
      title: '',
      content: '确定反馈作业情况',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if(res.confirm) {
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 10000
          })
          that.dofeedback()
        }
      }
    })
  }
  dofeedback() {
    //将作业情况反馈给家长
    this.setData({
      submit: true,
    })
    
    //丑 
    let finish = true   
    //语文
    if(this.data.Items[0].radioItem[0].checked) {
      this.setData({
        "po.chineseStatus": 2,        
      })
    }
    else if (this.data.Items[0].radioItem[1].checked) {
      this.setData({
        "po.chineseStatus": 1,
      })
      finish = false
    }
    else if (this.data.Items[0].radioItem[2].checked) {
      this.setData({
        "po.chineseStatus": 0,
      })
    }
    //数学
    if (this.data.Items[1].radioItem[0].checked) {
      this.setData({
        "po.mathStatus": 2,
      })
    }
    else if (this.data.Items[1].radioItem[1].checked) {
      this.setData({
        "po.mathStatus": 1,
      })
      finish = false
    }
    else if (this.data.Items[1].radioItem[2].checked) {
      this.setData({
        "po.mathStatus": 0,
      })
    }
    //英语
    if (this.data.Items[2].radioItem[0].checked) {
      this.setData({
        "po.englishStatus": 2,
      })
    }
    else if (this.data.Items[2].radioItem[1].checked) {
      this.setData({
        "po.englishStatus": 1,
      })
      finish = false
    }
    else if (this.data.Items[2].radioItem[2].checked) {
      this.setData({
        "po.englishStatus": 0,
      })
    }
    //其它
    if (this.data.Items[3].radioItem[0].checked) {
      this.setData({
        "po.otherStatus": 2,
      })
    }
    else if (this.data.Items[3].radioItem[1].checked) {
      this.setData({
        "po.otherStatus": 1,
      })
      finish = false
    }
    else if (this.data.Items[3].radioItem[2].checked) {
      this.setData({
        "po.otherStatus": 0,
      })
    }
    if (this.data.homeworktoday) {
      //必须设置id字段，表示更新
      console.log(this.data.homeworktoday.status)
      this.setData({
        "po.id": this.data.homeworktoday.id,   
        //有作业记录，说明作业已经提交        
        "po.status": finish ? 2 : 1,     
      })           
    }
    else {
      //设置status字段
      this.setData({
        //没有作业记录，说明没有提交作业
        "po.status": finish ? 2 : 0,
      })
    }
    this.$post("/v1/homework/update", this.data.po).then(data => {
      console.log(data)
    }).catch(err => {
      this.$showModal({
        title: '出错',
        content: err.msg,
        showCancel: false
      })
    })
  }
  feedbackinput(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    if(index == 0) {
      //语文反馈
      this.setData({
        "po.chineseFeedback": e.detail.value,
      })
    }
    else if(index == 1) {
      //数学反馈
      this.setData({
        "po.mathFeedback": e.detail.value,
      })
    }
    else if(index == 2) {
      //英语反馈
      this.setData({
        "po.englishFeedback": e.detail.value,
      })
    }
    else {
      //其它反馈
      this.setData({
        "po.otherFeedback": e.detail.value,
      })
    }
  }
  imgPreview(e) {
    let that = this
    let src = e.currentTarget.dataset.src;
    let imglist = e.currentTarget.dataset.list;  
    for(var i = 0; i < imglist.length; i++) {
      imglist[i] = this.data.imgBaseUrl + imglist[i].photoPath
    }  
    //console.log(e)    
    wx.previewImage({
      current: src,
      urls: imglist,
    })
    
  }
}