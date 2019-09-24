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
    //检查是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          //未授权
          wx.reLaunch({
            url: '/pages/funclist/funclist',
          });
        }
      }
    });
  }
  loadgradeInfo() {
    this.$get('/v1/grade/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj,
        gradeid: data.obj.webchatClazzList[this.data.index].gradeid,
        clazzid: data.obj.webchatClazzList[this.data.index].clazzid,
        gradename: data.obj.webchatClazzList[this.data.index].gradename,
        clazzname: data.obj.webchatClazzList[this.data.index].clazzname,
      });
      this.loadTechAttend();
      this.cinemaDetail(data.obj.webchatClazzList[this.data.index].gradeid);
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
        clazzid: data.obj.webchatClazzList[this.data.index].clazzid,
        gradename: data.obj.webchatClazzList[this.data.index].gradename,
        clazzname: data.obj.webchatClazzList[this.data.index].clazzname,
      });
      this.loadTechAttend();
      this.loadStudentInfo();
      this.cinemaDetail(data.obj.webchatClazzList[this.data.index].gradeid)
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
        this.cinemaDetail(data.obj.studentList[this.data.index].gradeid);
      } else{
		  wx.showModal({
			  title: '提示',
			  content: `您尚未有孩子关联学堂，无法访问`,
			  showCancel: false,
			  success(res) {
				  if (res.confirm) {
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
      });
    })
  }
  //获取机构详情
  cinemaDetail(id) {
    this.$get('/v1/school/getSchoolInfo?school=' + id).then(data => {
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
      console.log(data.obj)
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
        if (studentList[i].studentAttendanceList.length==0) {
          studentList[i].attend = 0; //缺勤
          attendList.push(studentList[i]);
        } else if (studentList[i].studentAttendanceList[0].type==2) {
          studentList[i].attend = 2; //请假
          notattendList.push(studentList[i]);
        } else {
          studentList[i].attend = 1; //已到
          notattendList.push(studentList[i]);
        }
      }
      this.setData({
        attendcnt: attendcnt,
        attendList: attendList,
        notattendList: notattendList,
        studentList: studentList,
        nowList: studentList,
      })
    });
  }
  
  
  jumpPage(e) {
    let item = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/activity/detail/detail?id=" + item.id
    });
  }
  jumpToStudentDetailed(e) {
    wx.navigateTo({
      url: "/pages/baby/StudentDetailed/StudentDetailed?studentid=" + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name
    });
  }
  
  changeStatus(e) {
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;
    let that = this
    if (e.currentTarget.dataset.attend!=1) {
      wx.showModal({
        title: '提示',
        content: '是否将学生  ' + name + '  改签为已到 ？',
        success(res) {
          if (res.confirm) {
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

}
