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
      console.log(data);
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
    console.log(e);
  //   let type = e.currentTarget.dataset.type; 
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
           console.log(filePath); 
           wx.openDocument({ 
             filePath: filePath, 
             success: function (res) { 
               wx.hideLoading()
               console.log('打开文档成功') 
               }, 
               fail: function (res) { 
                 wx.hideLoading()
                 console.log(res); 
                 }, 
                 complete: function (res) { 
                   console.log(res); 
                   } 
              }) 
          }, 
          fail: function (res) { 
            wx.hideLoading();
            that.$showModal({
              title: '文件下载失败',
              content: res.errMsg,
              showCancel: false
            })
            console.log(res)
            console.log('文件下载失败');
             }, 
             complete: function (res) { }, })
  }

  pay(){
    let that = this;
    let data = {
      "orderid": this.data.feed.noticeobject.orderid,
      "body": this.data.order.note,
    }

    this.$post("v1/order/payment", data).then(data => {
     console.log(data);
      wx.requestPayment({
        'timeStamp': data.obj.data.timeStamp,
        'nonceStr': data.obj.data.nonceStr,
        'package': data.obj.data.package,
        'signType': data.obj.data.signType,
        'paySign': data.obj.data.paySign,
        'success': function (res) {
          console.log(res);
          that.getorder()
        /*  let ticket = that.data.ticket;
          let price = that.data.vo.order.roomFee;
          if (ticket.ticketNo) {
            if (ticket.type == 0) {
              price = price - parseFloat(ticket.money);
            } else {
              price = price * parseFloat(ticket.rate) / 10;
            }
          }
          wx.navigateTo({
            url: '/pages/pay/paymentResult/paymentResult?price=' + price
          })*/
        },
        'fail': function (res) {
          that.$showModal({
            title: '错误',
            content: '支付失败',
            showCancel: false
          })
        },
        'complete': function (res) { }
      })
    }).catch(err => {
      console.log(err)
      that.$showModal({
        title: '错误',
        content: err.message,
        showCancel: false
      })

    });


          /*     wx.requestPayment(
                 {
                   'timeStamp': '',
                   'nonceStr': '',
                   'package': '',
                   'signType': 'MD5',
                   'paySign': '',
                   'success': function (res) { },
                   'fail': function (res) { },
                   'complete': function (res) { }
                 })*/




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
