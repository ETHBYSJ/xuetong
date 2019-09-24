let we = require('../../../we/index.js');
var WxParse = require('../../../wxParse/wxParse.js');

new class extends we.Page {
  data() {
    return {
      feed: [],
      order: [],
      imgBaseUrl: "",
      id: ""
    }
  }
  //事件处理函数
  onLoad(options) {
    var noticeid = options.id;
    this.setData({
      imgBaseUrl: this.$app.imgBaseUrl,
      id: noticeid 
    })
    this.$get('/v1/activity/' + noticeid).then(data => {
      var article = data.obj.content;
      WxParse.wxParse('article', 'html', article, this, 5);
      this.setData({
        feed: data.obj,
      })
     
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  } 
  //分享给朋友
  onShareAppMessage(res) {
    return {
      title: this.data.feed.heading,
      path: 'pages/activity/detail/detail?id='+this.data.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

  jumpPage() {
    if (this.$app.userdtatus==101) {
      wx.showModal({
        title: '提示',
        content: '您尚未注册登录，是否前往登录(登录前需要先进行微信授权)',
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
    } else if (this.$app.userdtatus==102) {
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
      });
    } else if (this.$app.userdtatus==103){
      wx.navigateTo({
        url: "../apply/apply?id=" + this.data.id + "&titlePhoto=" + this.data.feed.titlePhoto + "&heading=" + this.data.feed.heading + "&remains=" + this.data.feed.remains + "&familyPrice=" + this.data.feed.familyPrice + "&studentPrice=" + this.data.feed.studentPrice + "&familyEnable=" + this.data.feed.familyEnable + "&phone=" + this.data.feed.phone
      });
    }
    
  }
}
