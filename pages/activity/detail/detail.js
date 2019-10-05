let we = require('../../../we/index.js');
var WxParse = require('../../../wxParse/wxParse.js');

new class extends we.Page {
  data() {
    return {
      feed: [],
      order: [],
      imgBaseUrl: "",
      id: "",
      nowday: "",
    }
  }
  //事件处理函数
  onLoad(options) {
    var noticeid = options.id;
    this.setData({
      imgBaseUrl: this.$app.imgBaseUrl,
      id: noticeid 
    })
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
    })
    
  } 

  onShow() {
    this.$get('/v1/activity/' + this.data.id).then(data => {
      console.log(data)
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
      wx.navigateTo({
        url: "../apply/apply?id=" + this.data.id + "&titlePhoto=" + this.data.feed.titlePhoto + "&heading=" + this.data.feed.heading + "&remains=" + this.data.feed.remains + "&familyPrice=" + this.data.feed.familyPrice + "&studentPrice=" + this.data.feed.studentPrice + "&familyEnable=" + this.data.feed.familyEnable + "&phone=" + this.data.feed.phone,
      });
    } 
}
