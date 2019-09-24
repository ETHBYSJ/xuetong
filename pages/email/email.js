let we = require('../../we/index.js')
var util = require('../../utils/utilb.js')
var WxParse = require('../../wxParse/wxParse.js');

new class extends we.Page {
  data() {
    return {
      feed: [],
      currentTab: 2,
      page: 0,
      totalsize: "",
      size: 10,
      keyword:"",
      imgBaseUrl: "",
      nextload: true,
      scrollTop: 0,
      scrollHeight: 0,
    }
  }

  onLoad() {
    //检查是否授权
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          //未授权
          wx.reLaunch({
            url: '/pages/funclist/funclist',
          })
        }
      }
    })
  }

  onShow() {    
    this.setData({
      keyword: "",
      nextload: true,
      page: 0,
      imgBaseUrl: this.$app.imgBaseUrl,
      feed: [],
      scrollTop: this.data.scrollHeight,
    })

    this.$get('/v1/member').then(data => {
      if (!data.obj) {
        wx.showModal({
          title: '提示',
          content: '您尚未注册登录，是否前往登录',
          success(res) {
            if (res.confirm) {
              
              wx.switchTab({
                url: '../member/MemberCenter/MemberCenter',
              })
            } else if (res.cancel) {
              wx.switchTab({
                url: '../activity/index/index',
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

  onPageScroll(e) {
    this.setData({
      'scrollHeight': e.detail.scrollTop,
    });
  }

  //使用本地 fake 数据实现刷新效果
  getData() {
    if (this.data.nextload) {
      var page = this.data.page + 1;
      this.$get('/v1/notice/getUserNoticeByKeyword?page=' + page + '&size=' + this.data.size + '&status=' + this.data.currentTab + '&keyword=' + this.data.keyword).then(data => {
        if (data.totalSize <= page * this.data.size) {
          this.setData({
            nextload : false,
          });
        }
        
        this.setData({
          feed: this.data.feed.concat(data.obj),
          totalsize: data.totalSize,
          page: page,
        })

      }).catch(err => {
        this.$showModal({
          title: '获取信息错误',
          content: err.msg,
          showCancel: false
        })
      })
    } else {
      wx.showToast({
        title: '已经到底啦',
        icon: 'success',
        duration: 500,
      })
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
    this.setData({
      totalsize: 0,
      page: 0,
      nextload: true,
      feed: [],
    })
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
          url: '../baby/homework/index/index?studentid=' + studentId + '&name=' + studentName,
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
          url: '../member/confirmLeave/confirmLeave?studentid=' + studentId + '&name=' + studentName + '&img=' + studentPhoto + '&leaveid=' + this.data.feed[idx].obj.askForLeaveId + '&sendername=' + this.data.feed[idx].obj.senderName,
        });
      });
    } else if (noticetype == "ntOrderTrusteeship") {
      this.$get('/v1/notice/getUserNoticeById?noticeid=' + noticeid).then(res => {
        wx.navigateTo({
          url: '../baby/payment/paymentDetailed/paymentDetailed?id=' + this.data.feed[idx].obj.orderId,
        });
      });
    } else if (noticetype == "ntOrderActivity") {
      this.$get('/v1/notice/getUserNoticeById?noticeid=' + noticeid).then(res => {
        wx.navigateTo({
          url: '../activity/payment/payment?id=' + this.data.feed[idx].obj.orderId,
        });
      });
    }
    else {
      var data = this.data.feed;
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
      page:0,
      feed: [],
      totalsize: 0,
      nextload: true,
      scrollTop: 0,
    });
    this.getData();
  }  
   
  lower(e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.getData(); }, 1000);
  }
}