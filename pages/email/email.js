let we = require('../../we/index.js')
var util = require('../../utils/utilb.js')
var WxParse = require('../../wxParse/wxParse.js');

new class extends we.Page {
  data() {
    return {
    feed: [],
    currentTab: 2,
    page:1,
    totalsize: "",
    size: 10,
    keyword:"",
    imgBaseUrl: "",
    }
  }
  //input框事件处理
  bindKeyword(e){
    this.setData({
      keyword: e.detail.value,
    });
  }
  //搜索消息
  searchEmail(){
    this.$get('/v1/notice/getUserNoticeByKeyword?page=1&size=' + this.data.size + '&status=' + this.data.currentTab+'&keyword='+this.data.keyword).then(data => {
     
      if (data.totalSize % data.pageSize != 0) {
        var totalsize = Math.ceil(data.totalSize / data.pageSize);
      } else {
        var totalsize = data.totalSize / data.pageSize;
      }
      this.setData({
        feed: data.obj,
        totalsize: totalsize,
      })
     
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })

  }

  //事件处理函数
  bindItemTap(e) {
    //console.log(e);
    //console.log(this.data.feed)
    var idx = e.currentTarget.dataset.idx;
    var noticetype = this.data.feed[idx].notice.noticetype;
    var studentId = this.data.feed[idx].obj.studentId;
    var reportId = this.data.feed[idx].obj.reportId;
    var studentName = this.data.feed[idx].obj.studentName;
    var studentPhoto = this.data.imgBaseUrl + this.data.feed[idx].obj.studentPhoto;
    var noticeid = e.currentTarget.dataset.type;
    if (noticetype == "ntHomework") {
      this.$get('/v1/notice/getUserNoticeById?noticeid=' + noticeid).then(res => {
        wx.navigateTo({
          url: '../baby/homework/index/index?studentid=' + studentId + '&name=' + tstudentName,
        });
      }); 
    } else if (noticetype == "ntWeeklyReport") {
      this.$get('/v1/notice/getUserNoticeById?noticeid=' + noticeid).then(res => {
        wx.navigateTo({
          url: '../member/studentStudy/studentStudy?id=' + reportId + '&studentid=' + studentId + '&name=' + studentName + '&img=' + studentPhoto,
        });
      });
    } else if (noticetype == "ntTrusteeship") {
      this.$get('/v1/notice/getUserNoticeById?noticeid=' + noticeid).then(res => {
        wx.navigateTo({
          url: '../baby/payment/payment?studentid=' + studentId + '&name=' + studentName + '&img=' + studentPhoto,
        });
      });
    } else if (noticetype == "ntAskForLeave") {
      this.$get('/v1/notice/getUserNoticeById?noticeid=' + noticeid).then(res => {
        wx.navigateTo({
          url: '../member/confirmLeave/confirmLeave?studentid=' + studentId + '&name=' + studentName + '&img=' + studentPhoto + '&leaveid=' + this.data.feed[idx].obj.askForLeaveId,
        });
      });
    }
    /*else if (noticetype == "ntOrderTrusteeship") {
      wx.navigateTo({
        url: '../baby/payment/paymentDetailed/paymentDetailed?studentid=' + this.data.feed[e.currentTarget.dataset.idx].obj.studentId + '&name=' + this.data.feed[e.currentTarget.dataset.idx].obj.studentName + '&img=' + this.data.imgBaseUrl + this.data.feed[e.currentTarget.dataset.idx].obj.studentPhoto + '&orderId=' + this.data.feed[e.currentTarget.dataset.idx].obj.orderId,
      })
    }*/
    
    else {
      var data = this.data.feed;
      //console.log(index)
      data[idx].x = true;
      this.setData({
        feed: data
      })
      wx.navigateTo({
        url: '../answer/answer?noticeid=' + noticeid,
      })
    }
    }

  //导航事件处理函数
  swichNav(e){
    var current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current,
      page:1,
    });
    this.$get('/v1/notice/getUserNoticeByKeyword?page=' + this.data.page + '&size=' + this.data.size + '&status=' + this.data.currentTab + '&keyword=' + this.data.keyword).then(data => {
      console.log(data);
      if (data.totalSize % data.pageSize != 0) {
        var totalsize = Math.ceil(data.totalSize / data.pageSize);
      } else {
        var totalsize = data.totalSize / data.pageSize;
      }
      this.setData({
        feed: data.obj,
        totalsize: totalsize,
      })
    }).catch(err => {
      wx.showModal({
        title: '获取信息错误',
        content: '',
        showCancel: false
      })
    })

  }  
   
  onLoad(){
    //调用应用实例的方法获取全局数据
    
  } 
  
  onShow() {
    this.setData({
      keyword:"",
      imgBaseUrl: this.$app.imgBaseUrl,
    })

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
			  this.getData();
		  }
	  }).catch(err => {
		  if (err) {
			  this.data.vo.coderesult = err
			  this.$showModal({
				  title: '提示',
				  content: '您尚未登录或获取信息失败',
				  showCancel: false
			  })
		  } else {
			  this.$showModal({
				  title: '提示',
          content: '您尚未登录或获取信息失败',
				  showCancel: false
			  })
		  }
	  })
  }
  upper() {
    wx.showNavigationBarLoading()
    this.refresh();
    //console.log("upper");
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 1000);
  }
  lower(e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    //console.log("lower")
  }
  //scroll: function (e) {
  //  console.log("scroll")
  //},

  //使用本地 fake 数据实现刷新效果
  getData() {
 /*   var feed = util.getData2();
    console.log("loaddata");
    var feed_data = feed.data;
    this.setData({
      feed: feed_data,
      feed_length: feed_data.length
    });*/
    //console.log('/v1/notice/getUserNotice?page=' + this.data.page + '&size=' + this.data.size + '&status=' + this.data.currentTab)
    this.$get('/v1/notice/getUserNotice?page='+this.data.page+'&size=' + this.data.size + '&status='+this.data.currentTab).then(data => {
      console.log(data);
      if (data.totalSize % data.pageSize!=0){
        var totalsize = Math.ceil(data.totalSize / data.pageSize);
      } else{
        var totalsize = data.totalSize / data.pageSize;
      } 
      this.setData({
        feed: data.obj,
        totalsize: totalsize,
      })
  
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })

  }
  refresh() {
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 3000
    });
    this.$get('/v1/notice/getUserNotice?page=1&size=' + this.data.size +'&status=' + this.data.currentTab).then(data => {
      this.setData({
        feed: data.obj,
        page: 1,
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
        title: '刷新成功',
        icon: 'success',
        duration: 2000
      })
    }, 500)

  }

  //使用本地 fake 数据实现继续加载效果
  nextLoad() {
    if (this.data.page != this.data.totalsize){
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
      this.$get('/v1/notice/getUserNotice?page=' + page + '&size=' + this.data.size +'&status=' + this.data.currentTab).then(data => {
        this.setData({
          feed: data.obj,
          feed: this.data.feed.concat(data.obj),
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