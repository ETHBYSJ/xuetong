//报名后显示活动详情
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
      path: 'pages/activity/detail/detail?id=' + this.data.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

}
