let we = require('../../we/index.js');
var WxParse = require('../../wxParse/wxParse.js');

new class extends we.Page {
  data(){
    return {
      feed:[],
      order:[],
      imgBaseUrl:""
      }
  }
  //事件处理函数
  onLoad(options) {
    var noticeid = options.noticeid;
    this.setData({
      imgBaseUrl: this.$app.imgBaseUrl
    })
    this.$get('/v1/notice/getUserNoticeById?noticeid=' + noticeid).then(data => {
      var article = data.obj.notice.content;
      WxParse.wxParse('article', 'html', article, this, 5);
      this.setData({
        feed: data.obj,
      })
      if (data.obj.notice.noticetype == "ntOrder"){
         this.getorder();
      }
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
  
  downloadFile(e){
    wx.showLoading({
      title: '文件下载中',
      icon: 'loading',
      mask:true,
    })
    let that = this;
    let url = e.currentTarget.dataset.url; 
      wx.downloadFile({
        url: url,
        header: {}, 
        success: function (res) {
          var filePath = res.tempFilePath; 
          wx.openDocument({ 
            filePath: filePath, 
            success: function (res) { 
              wx.hideLoading()
            }, 
            fail: function (res) { 
              wx.hideLoading()
            }, 
            complete: function (res) { 
            } 
          }) 
        }, 
        fail: function (res) { 
          wx.hideLoading();
          that.$showModal({
            title: '文件下载失败',
            content: res.errMsg,
            showCancel: false
          });
        }, 
        complete: function (res) { }, 
      })
  }

  pay(){
    let that = this;
    let data = {
      "orderid": this.data.feed.noticeobject.orderid,
      "body": this.data.order.note,
    }

    this.$post("v1/order/payment", data).then(data => {
      wx.requestPayment({
        'timeStamp': data.obj.data.timeStamp,
        'nonceStr': data.obj.data.nonceStr,
        'package': data.obj.data.package,
        'signType': data.obj.data.signType,
        'paySign': data.obj.data.paySign,
        'success': function (res) {
          that.getorder();
        },
        'fail': function (res) {
          that.$showModal({
            title: '错误',
            content: '支付失败',
            showCancel: false
          });
        },
      })
    }).catch(err => {
      that.$showModal({
        title: '错误',
        content: err.message,
        showCancel: false
      })

    });
  }

  getorder(){
    this.$get('/v1/order/' + this.data.feed.noticeobject.orderid).then(data => {
      this.setData({
        order: data.obj,
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
}
