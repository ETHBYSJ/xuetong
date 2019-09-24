let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      noticeid:"",
      hidden:true,
      userdtatus:"",
      po: {
      },
      vo: {
        UserInfo: {},
        unreadCount:0,
        message: {},
      },
      head_address: '点击可以设置您的地址',
      tail_address: '未填写详细地址',
      unpaid_num: 0,
    }
  }

  onLoad(options) {
    let that = this
    if (options.noticeid){
      this.setData({
        noticeid: options.noticeid
      })
    }
  }
  onShow() {
    this.setData({
      'vo.imgBaseUrl': this.$app.imgBaseUrl,
      userdtatus: this.$app.userdtatus,
    });
    if (this.data.userdtatus == 103) { 
      this.setData({
        hidden: false,
      });
      this.getUserStatusByLogin();
      this.getOrderNumber();
    } else if (this.data.userdtatus == 101) {
      wx.showModal({
        title: '提示',
        content: '您尚进行微信授权，是否跳转到授权页面授权后进行登陆？',
        success(res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../../funclist/funclist',
            });
          } else if (res.cancel) {
            wx.switchTab({
              url: '../../activity/index/index',
            });
          }
        }
      });
    } else if (this.data.userdtatus == 102) {
      wx.reLaunch({ url: `/pages/member/register/register` });
    }
    
  }
  
  bindToUnpaid() {
    this.$navigateTo({
      url: '/pages/member/myEnroll/myEnroll?status=0',
    })
  }

  bindToDoing() {
    this.$navigateTo({
      url: '/pages/member/myEnroll/myEnroll?status=1',
    })
  } //进行中

  bindToTotal() {
    this.$navigateTo({
      url: '/pages/member/myEnroll/myEnroll?status=all',
    })
  }


  /*获取用户未读信息*/
  getUserNoticeCount(){
    this.$get('/v1/notice/getUserNoticeCount').then(data => {
      this.setData({
        'vo.unreadCount': data.obj.unreadCount
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
  getUserStatusByLogin() {
    this.getUserNoticeCount();
      this.setData({
          hidden: false,
        })
    if (this.data.noticeid) {
      wx.navigateTo({
        url: '/pages/answer/answer?noticeid=' + this.data.noticeid
      })
      this.data.noticeid = null
    } else {
      this.UserInfo()
    }
  }

  getOrderNumber() {
    this.$get('/v1/order/getList?status=0&type=1').then(res1 => {
      this.setData({
        'unpaid_num': res1.totalSize,
      });
    });
    this.$get('/v1/order/getList?status=1&type=1').then(res2 => {
      this.setData({
        'paid_num': res2.totalSize,
      });
    });
  }
  //switch handler
  switch() {
    //wx.removeStorageSync("__session__");
    wx.reLaunch({
      url: '/pages/member/register/register',
    })
  }
  UserInfo() {
   this.$get('/v1/member').then(data => {
      this.setData({
        'vo.UserInfo': data.obj,
      })
      //console.log(data.obj);
     this.$app.userType = data.obj.userType;

     if (data.obj.userType == '家长') {
       this.loadInfo()
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


  loadInfo() {
    this.$get('/v1/family/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })
      //console.log(data.obj)
      if (data.obj.address != null && data.obj.address != undefined) {
        var tmp = data.obj.address.split('#');
        this.setData({
          'head_address': tmp[0],
          'tail_address': tmp[1],
        })
      }
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
}