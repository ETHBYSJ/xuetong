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
      clazzid:"",
      gradename:"",
      clazzname:"",
      userType:"",
      currentTab:2,
      date:"",
      activityList: [null, null, null],
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
        console.log("---------------")
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
      console.log(this.data.clazzid)
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  }

  //导航事件处理函数
  swichNav(e) {
    var current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current,

    });
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
      console.log(data.obj.webchatClazzList)
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
      console.log(data.obj.webchatClazzList)
      this.setData({
        'vo.message': data.obj,
        gradeid: data.obj.webchatClazzList[this.data.index].gradeid,
      //  studentid: data.obj.studentList[this.data.index].id,
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
  loadInfo() {
    this.$get('/v1/family/getInfo').then(data => {
      if (data.obj){
      this.setData({
        'vo.message': data.obj,
        gradeid: data.obj.studentList[this.data.index].gradeid,
        studentid: data.obj.studentList[this.data.index].id,
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
      console.log(data.obj)
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
        //console.log(i)
        var activity_ele = "activityList[" + i + "]"
        this.setData({
          [activity_ele]: data.obj[i],
        })
      }
      console.log(this.data.activityList)
    })
  }

  loadTechAttend() {
    this.$get('/v1/attendance/getTeacherAttendanceEverydayList?clazzid=' + this.data.clazzid + '&date=' + this.data.vo.nowDay).then(data => {
      console.log(data.obj)
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
    console.log(e)
    let item = e.currentTarget.dataset;
    wx.navigateTo({
      url: "/pages/activity/detail/detail?id=" + item.id
    })
  }
}
