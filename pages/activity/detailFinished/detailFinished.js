let we = require('../../../we/index.js');
var WxParse = require('../../../wxParse/wxParse.js');

new class extends we.Page {
  data() {
    return {
      feed: [],
      order: [],
      imgBaseUrl: "",
      id: "",
      imgList: [],
      leftMargin: '205rpx',
      rightMargin: '205rpx',
      currentImage: 0,
      currentIndex: 0,
      //评论数量
      commentNum: "",
      //评论列表
      commentList: [], 
      po: {
        //输入的评论
        content: "",
        activityId: "",
      },
      //跳转位置
      toView: "",
    }
  }
  //事件处理函数
  onLoad(options) {
    var noticeid = options.id;
    this.setData({
      imgBaseUrl: this.$app.imgBaseUrl,
      id: noticeid,
      "po.activityId": noticeid,
    })
    this.$get('/v1/activity/' + noticeid).then(data => {
      var article = data.obj.content;
      WxParse.wxParse('article', 'html', article, this, 5);
      this.setData({
        feed: data.obj,
        imageList: data.obj.imageList,
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: '获取活动信息出错',
        showCancel: false
      })
    })
  }
  onShow() {
    //加载评论列表
    this.getCommentList()
  }
  getCommentList() {
    this.$get('/v1/activity/getCommentList?id=' + this.data.id).then(data => {
      this.setData({
        commentList: data.obj,
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: '获取评论出错',
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

  jumpPage() {
    let that = this;
    wx.navigateTo({
      url: "../apply/apply?id=" + this.data.id + "&titlePhoto=" + this.data.feed.titlePhoto + "&heading=" + this.data.feed.heading + "&remains=" + this.data.feed.remains + "&familyPrice=" + this.data.feed.familyPrice + "&studentPrice=" + this.data.feed.studentPrice + "&familyEnable=" + this.data.feed.familyEnable + "&phone=" + this.data.feed.phone
    })
  }
  toLeft(e) {
    let length = e.currentTarget.dataset.length
    this.setData({
      currentIndex: (this.data.currentImage + length - 1) % length,
    })
  }
  toRight(e) {
    let length = e.currentTarget.dataset.length
    this.setData({
      currentIndex: (this.data.currentImage + length + 1) % length,
    })
  }
  handleChange(e) {
    this.setData({
      currentImage: e.detail.current,
    })
  }
  //预览图片
  imgPreview(e) {
    let src = e.currentTarget.dataset.src;
    //暂时只允许浏览当前一张图片
    wx.previewImage({
      current: src,
      urls: [this.data.imgBaseUrl + src],
    })
  }
  inputComment(e) {
    this.setData({
      "po.content": e.detail.value,
    })
  }
  //发表评论
  postComment() {
    this.$post('/v1/activity/comment', this.data.po).then(data => {
      this.getCommentList()
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: '获取评论出错',
        showCancel: false
      })
    })
  }
  momentJump(e) {
    this.setData({
      toView: "jump",
    })
  }
}
