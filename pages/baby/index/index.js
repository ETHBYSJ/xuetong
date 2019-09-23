let we = require('../../../we/index.js')


new class extends we.Page {
  data() {
    return {
      feed:[],
      vo: {
        'BackgroundImg': 'http://pic.616pic.com/bg_w1180/00/11/52/pKsDC2YqzS.jpg!/fh/300',
        message: {},
        nowDate:"",
        nowDay:"",
        cinemaDetails:[],
        CarouselDetails:"",
      },
      index:0,
      gradeid:"",
      studentid:"",
      studentimg: "",
      clazzid:"",
      gradename:"",
      clazzname:"",
      userType:"",
      currentTab:2,
      date:"",
      activityList: [null, null, null],
      //当前渲染列表
      nowList: [],
      //学生信息列表
      studentList: [],
      //缓存，减少http请求次数
      attendList: [],
      notattendList: [],
      height: "100vh", //swiper高度     
      //已签
      attendcnt: '',
      //未签
      //notattendcnt: '', 
      //是否显示电话号码
      showModalStatus: false,
      //现在查看的电话
      currentIndex: "",
      scrolltop: "",
      phoneindex: 0,
      
    }
  }
  bindChangeIndex(e) {
    this.setData({
      phoneindex: e.detail.value,
    })
    let that = this
    if (e.currentTarget.dataset.phonelist.length != 0 && e.currentTarget.dataset.phonelist[e.detail.value].phone) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.phonelist[e.detail.value].phone,
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    }    
  }
  onShow(){
	  this.$get('/v1/member').then(data => {
		  if (!data.obj) {
			  wx.showModal({
				  title: '提示',
				  content: '您尚未注册登录，是否前往登录',
				  success(res) {
					  if (res.confirm) {
						  wx.switchTab({
							  url: '../../member/MemberCenter/MemberCenter',
						  })
					  } else if (res.cancel) {
						  wx.switchTab({
							  url: '../../activity/index/index',
						  })
					  }
				  }
			  })
		  } else {
			  this.$app.userType = data.obj.userType;
			  this.setData({
				  'userType': this.$app.userType
			  })
			  if (this.$app.userType == '教职工') {
				  this.loadTechInfo()
			  } else if (this.$app.userType == '门店管理员') {
				  this.loadgradeInfo()
			  } else {
				  this.loadInfo()
          this.loadActivity();
			  }
		  }
	  }).catch(err => {
		  if (err) {
			  this.data.vo.coderesult = err
			  this.$showModal({
				  title: '提示',
				  content: `${err.message}`,
				  showCancel: false
			  })
		  } else {
			  this.$showModal({
				  title: '提示',
				  content: err.msg,
				  showCancel: false
			  })
		  }
	  })
  }
  //滑动页面处理函数
  onSlideChangeEnd(e) {
    if (this.$app.userType == '教职工'){
      this.setData({
        index: e.detail.current,
        gradeid: this.data.vo.message.webchatClazzList[e.detail.current].gradeid,
        clazzid: this.data.vo.message.webchatClazzList[e.detail.current].clazzid,
        clazzname: this.data.vo.message.webchatClazzList[e.detail.current].clazzname,
        gradename: this.data.vo.message.webchatClazzList[e.detail.current].gradename,
      })
      this.loadTechInfo();
    } else if (this.$app.userType == '门店管理员'){
      this.setData({
        index: e.detail.current,
        gradeid: this.data.vo.message.webchatClazzList[e.detail.current].gradeid,
        clazzid: this.data.vo.message.webchatClazzList[e.detail.current].clazzid,
        clazzname: this.data.vo.message.webchatClazzList[e.detail.current].clazzname,
        gradename: this.data.vo.message.webchatClazzList[e.detail.current].gradename,
      })
      this.loadgradeInfo();
      }else{
      this.setData({
        index: e.detail.current,
        gradeid: this.data.vo.message.studentList[e.detail.current].gradeid,
     //   studentid: this.data.vo.message.studentList[e.detail.current].id,
        clazzid: this.data.vo.message.studentList[e.detail.current].clazzid,
        gradename: this.data.vo.message.studentList[e.detail.current].gradename,
        clazzname: this.data.vo.message.studentList[e.detail.current].clazzname,
      })
      this.loadInfo();
    }
   
  }
  //日期选择处理函数
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
    //刷新学生数据
    this.loadStudentInfo()
  }

  //导航事件处理函数
  swichNav(e) {
    var current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current,
    });
    if(current == 2) {
      this.setData({
        nowList: this.data.studentList,
      })
    }
    else if(current == 1) {
      this.setData({
        nowList: this.data.attendList,
      })
    }
    else {
      //current == 0
      this.setData({
        nowList: this.data.notattendList,
      })
    }

  }
  onLoad() {
    this.setData({
      'vo.imgBaseUrl': this.$app.imgBaseUrl
    })
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    this.setData({
      'vo.nowDate': year + "年" + month + "月" + day + "日",
      'vo.nowDay': year + "-" + month + "-" + day,
      'date': year + "-" + month + "-" + day,
    })
  }
  loadgradeInfo() {
    this.$get('/v1/grade/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj,
        gradeid: data.obj.webchatClazzList[this.data.index].gradeid,
        // studentid: data.obj.studentList[this.data.index].id,
        clazzid: data.obj.webchatClazzList[this.data.index].clazzid,
        gradename: data.obj.webchatClazzList[this.data.index].gradename,
        clazzname: data.obj.webchatClazzList[this.data.index].clazzname,
      });
      this.loadTechAttend();
      this.cinemaDetail(data.obj.webchatClazzList[this.data.index].gradeid)
    //  this.loadCarousel(data.obj.webchatClazzList[this.data.index].gradeid)
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
  loadTechInfo() {
    this.$get('/v1/teacher/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj,
        gradeid: data.obj.webchatClazzList[this.data.index].gradeid,
      //  studentid: data.obj.studentList[this.data.index].id,
        clazzid: data.obj.webchatClazzList[this.data.index].clazzid,
        gradename: data.obj.webchatClazzList[this.data.index].gradename,
        clazzname: data.obj.webchatClazzList[this.data.index].clazzname,
      });
      this.loadTechAttend();
      this.loadStudentInfo();
      this.cinemaDetail(data.obj.webchatClazzList[this.data.index].gradeid)
    //  this.loadCarousel(data.obj.webchatClazzList[this.data.index].gradeid)
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
  loadInfo() {
    this.$get('/v1/family/getInfo').then(data => {
      if (data.obj){
      this.setData({
        'vo.message': data.obj,
        gradeid: data.obj.studentList[this.data.index].gradeid,
        studentid: data.obj.studentList[this.data.index].id,
        studentimg: data.obj.studentList[this.data.index].photo,
        clazzid: data.obj.studentList[this.data.index].clazzid,
        gradename: data.obj.studentList[this.data.index].gradename,
        clazzname: data.obj.studentList[this.data.index].clazzname,
      });
      this.loadAttend();
      this.cinemaDetail(data.obj.studentList[this.data.index].gradeid)
   //   this.loadCarousel(data.obj.studentList[this.data.index].gradeid)
      }else{
		  wx.showModal({
			  title: '提示',
			  content: `您尚未有孩子关联学堂，无法访问`,
			  showCancel: false,
			  success(res) {
				  if (res.confirm) {
					  console.log('用户点击确定')
					  wx.switchTab({
						  url: '../../activity/index/index',
					  })
				  } else if (res.cancel) {
				  }
			  }
		  })
      }
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
		  content: `${err.message}`,
        showCancel: false
      })
    })
  }

  //获取轮播图
/*  loadCarousel(id) {
    this.$get('/v1/school/getSchoolCarousel?school=' + id).then(data => {
      this.setData({
        'vo.CarouselDetails': data.obj[0],
      })
    }).catch(err => {
      if (err) {
        this.data.vo.coderesult = err
        this.$showModal({
          title: '提示',
          content: `${err.message}`,
          showCancel: false
        })
      } else {
        this.$showModal({
          title: '提示',
          content: err.msg,
          showCancel: false
        })
      }
    })
  }*/
  //获取机构详情
  cinemaDetail(id) {
    this.$get('/v1/school/getSchoolInfo?school=' + id).then(data => {
      console.log(data.obj);
      this.setData({
        'vo.cinemaDetails': data.obj,
      })
    }).catch(err => {
      if (err) {
        this.data.vo.coderesult = err
        this.$showModal({
          title: '提示',
          content: `${err.message}`,
          showCancel: false
        })
      } else {
        this.$showModal({
          title: '提示',
          content: err.msg,
          showCancel: false
        })
      }
    })
  }
  loadAttend() {
    this.$get('/v1/attendance/getStudentAttendanceEverydayList?student=' + this.data.studentid + '&date=' + this.data.vo.nowDay).then(data => {
      this.setData({
        feed: data.obj[0],
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }

  loadActivity() {
    this.$get('/v1/activity/getActivityList?page=1&size=10&status=0&keyword=&address=').then(data => {      
      for(var i = 0; i < data.obj.length; i++) {
        if(i == 3) break
        var activity_ele = "activityList[" + i + "]"
        this.setData({
          [activity_ele]: data.obj[i],
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

  loadTechAttend() {
    this.$get('/v1/attendance/getTeacherAttendanceEverydayList?clazzid=' + this.data.clazzid + '&date=' + this.data.vo.nowDay).then(data => {
      this.setData({
        feed: data.obj[0],
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
  
  loadStudentInfo() {
    this.$get('/v1/student/getList?gradeId=' + this.data.gradeid + '&clazzId=' + this.data.clazzid).then(data => {
      console.log(data)
      let studentList = data.obj
      this.setData({
        nowList: data.obj,
        height: 800 + 201 * data.obj.length,
      })
      let attendcnt = 0
      //缓存，减少http请求次数
      let attendList = []
      let notattendList = []
      for(var i = 0; i < data.obj.length; i++) {
        for (var j = 0; j < studentList[i].webchatFamilyInfoList.length; j++) {
          studentList[i].webchatFamilyInfoList[j].key = studentList[i].webchatFamilyInfoList[j].name + ' ' + studentList[i].webchatFamilyInfoList[j].phone
        }
      }
      //统计出勤情况
      for(var i = 0; i < data.obj.length; i++) {
        let ifattend = studentList[i].studentAttendanceList.length != 0
        attendcnt += ifattend ? 1 : 0
        studentList[i].attend = ifattend
        if(ifattend) {
          attendList.push(studentList[i])
        }
        else {
          attendList.push(studentList[i])
        }        
      }
      this.setData({
        attendcnt: attendcnt,
        attendList: attendList,
        notattendList: notattendList,
        studentList: studentList,
        nowList: studentList,
      })
    })
    /* 
    this.$get('/v1/student/datalist?gradeId=' + this.data.gradeid + '&clazzId=' + this.data.clazzid).then(data => {
      let studentList = data.obj
      console.log(studentList)
      this.setData({
        nowList: data.obj,
        height: 800 + 201 * data.obj.length,
      })
      let attendcnt = 0
      //let notattendcnt = 0
      let attend_promises = []
      let homework_promises = []
      //缓存，减少http请求次数
      let attendList = []
      let notattendList = []
      
      //保存引用
      let that = this
      for(var i = 0; i < data.obj.length; i++) {
        let temp = i
        for (var j = 0; j < studentList[temp].webchatFamilyInfoList.length; j++) {
          studentList[temp].webchatFamilyInfoList[j].key = studentList[temp].webchatFamilyInfoList[j].name + ' ' + studentList[temp].webchatFamilyInfoList[j].phone
        }        
        //出勤情况
        //使用Promise包装，方便进行同步
        attend_promises.push(this.$get('/v1/attendance/getStudentAttendanceEverydayList?student=' + data.obj[temp].id + '&date=' + this.data.date).then(data => {
          let ifattend = data.obj[0].studentEverydayAttendanceVOList[0].attendanceStudentList.length != 0
          attendcnt += ifattend ? 1 : 0   
          studentList[temp].attend = ifattend
          if (ifattend) {
            attendList.push(studentList[temp])
          }
          else {
            notattendList.push(studentList[temp])
          }
          return(data)
        }).catch(err => {
          this.$showModal({
            title: '出错',
            content: err.msg,
            showCancel: false
          })
        }))
        homework_promises.push(this.$get('/v1/homework/getByStudentIdAndDate?id=' + data.obj[temp].id + '&date=' + this.data.date).then(data => {
          studentList[temp].homework = data.obj && data.obj.status != 0
        }).catch(err => {
          this.$showModal({
            title: '出错',
            content: err.msg,
            showCancel: false
          })
        }))
        
      }
      //同步
      Promise.all(attend_promises).then(function(results) {           
        that.setData({
          attendcnt: attendcnt,
          //notattendcnt: that.data.studentList.length - attendcnt,
          attendList: attendList,
          notattendList: notattendList,
          studentList: studentList,
          nowList: studentList,
        })
        
      }).catch(err => {
        this.$showModal({
          title: '出错',
          content: err.msg,
          showCancel: false
        })
      })
      Promise.all(homework_promises).then(function (results) {
        that.setData({
          attendcnt: attendcnt,
          //notattendcnt: that.data.studentList.length - attendcnt,
          attendList: attendList,
          notattendList: notattendList,
          studentList: studentList,
          nowList: studentList,
        })        
      }).catch(err => {
        this.$showModal({
          title: '出错',
          content: err.msg,
          showCancel: false
        })
      })
           
    })
  */
  }
  
  changeImg(){
    wx.showActionSheet({
      itemList: ['更换相册封面'],
      success: function (res) {
        wx.navigateTo({ url: `../CropPhoto/CropPhoto`})
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })  



  /*   var that =this;
     wx.chooseImage({
       count: 1, // 默认9
       sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
       sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
       success: function (res) {
         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
         var tempFilePaths = res.tempFilePaths;
         that.setData({
           'vo.BackgroundImg': tempFilePaths
         })
         wx.setStorageSync("__imgbg__", tempFilePaths)
         console.log(wx.getStorageSync("__imgbg__"));
        
       }
     })*/

  }
  jumpPage(e) {
    let item = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/activity/detail/detail?id=" + item.id
    })
  }
  jumpToStudentDetailed(e) {
    wx.navigateTo({
      url: "/pages/baby/StudentDetailed/StudentDetailed?studentid=" + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name
    })
  }
  
  changeStatus(e) {
    let name = e.currentTarget.dataset.name
    let id = e.currentTarget.dataset.id
    console.log(id)
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否将学生  ' + name + '  改签为已到 ？',
      success(res) {
        if(res.confirm) {
          that.$get('/v1/attendance/changeReachStatusByStudentId?studentId=' + id).then(data => {
            wx.showModal({
              title: '提示',
              content: '已将学生' + name + '改签为已到!',
              showCancel: false,
            })
            that.loadStudentInfo()
          }).catch(err => {
            if (err) {
              that.$showModal({
                title: '提示',
                content: `${err.message}`,
                showCancel: false
              })
            } else {
              that.$showModal({
                title: '提示',
                content: err.msg,
                showCancel: false
              })
            }
          })
        }
      }
    })
  }

}
