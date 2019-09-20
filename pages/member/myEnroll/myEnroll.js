let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      po: {
      },
      vo: {
        orderList: [],
      },
      status: null,
      pageNo: 0,
      totalSize: 0,
      nextload : true,
      scrolltop: 0,
    }
  }

  onLoad(options) {
    this.setData({ 
      status: options.status,
      action: options.action==undefined ? null : options.action,
    })
    this.setData({
      imgBaseUrl: this.$app.imgBaseUrl
    })
  }

  onShow() {
    this.getOrderList();
  }

  lower(e) {
    wx.showNavigationBarLoading()
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.getOrderList(); }, 1000);
    console.log("lower")
  }

  getOrderList() {
    if (this.data.nextload == true) {
      var page = this.data.pageNo + 1;
      this.$get('/v1/order/getOrderList?page=' + page + '&status=' + this.data.status).then(data => {
        console.log(data)
        if (data.msg == 'SUCC') {
          //判断能否继续加载
          this.setData({
            'totalSize': data.totalSize,
            'pageNo': page,
          })
          if (this.data.pageNo * 10 >= this.data.totalSize) {
            this.setData({
              'nextload': false,
            })
          }
          //数据处理
          var tmp = this.data.vo.orderList;
          if (this.data.status == '全部') {
            for (let i in data.obj) {
              if (data.obj[i].orderType == 1) {
                var title = data.obj[i].activityHeading == null ? ['', ''] : data.obj[i].activityHeading.split('|',2);
                tmp.push({
                  'id': data.obj[i].id,
                  'activityHeading': title[0],
                  'activityTitle': (title[1] == undefined ? '' : title[1]),
                  'activityQuota': data.obj[i].activityQuota,
                  'activityTitlePhoto': data.obj[i].activityTitlePhoto,
                  'activityStatus': data.obj[i].activityStatus,
                  'activityRemains': data.obj[i].activityRemains,
                  'activityId': data.obj[i].activityId,
                  'orderSn': data.obj[i].orderSn,
                  'status': data.obj[i].status,
                  'payAmount': data.obj[i].payAmount,
                });
              }
            }
            this.setData({
              'vo.orderList': tmp,
            });
            console.log(tmp);
          } else if (this.data.status != null) { //
            if(this.data.action != null && this.data.action != undefined) { //已支付
              var tmp = this.data.vo.orderList;
              for (let i in data.obj) {
                if (data.obj[i].status == this.data.status && data.obj[i].orderType == 1 && data.obj[i].activityStatus == this.data.action) {
                  var title = data.obj[i].activityHeading == null ? ['', ''] : data.obj[i].activityHeading.split('|', 2);
                  tmp.push({
                    'id': data.obj[i].id,
                    'activityHeading': title[0],
                    'activityTitle': (title[1] == undefined ? '' : title[1]),
                    'activityQuota': data.obj[i].activityQuota,
                    'activityTitlePhoto': data.obj[i].activityTitlePhoto,
                    'activityStatus': data.obj[i].activityStatus,
                    'activityRemains': data.obj[i].activityRemains,
                    'activityId': data.obj[i].activityId,
                    'orderSn': data.obj[i].orderSn,
                    'status': data.obj[i].status,
                    'payAmount': data.obj[i].payAmount,
                  });
                } 
              } 
            } else { //未支付
              var tmp = this.data.vo.orderList;
              for (let i in data.obj) {
                if (data.obj[i].status == this.data.status && data.obj[i].orderType == 1) {
                  var title = data.obj[i].activityHeading == null ? ['', ''] : data.obj[i].activityHeading.split('|', 2);
                  tmp.push({
                    'id': data.obj[i].id,
                    'activityHeading': title[0],
                    'activityTitle': (title[1]==undefined ? '' : title[1]),
                    'activityQuota': data.obj[i].activityQuota,
                    'activityTitlePhoto': data.obj[i].activityTitlePhoto,
                    'activityStatus': data.obj[i].activityStatus,
                    'activityRemains': data.obj[i].activityRemains,
                    'activityId': data.obj[i].activityId,
                    'orderSn': data.obj[i].orderSn,
                    'status': data.obj[i].status,
                    'payAmount': data.obj[i].payAmount,
                  });
                }
              } 
            }
            
            this.setData({
              'vo.orderList': tmp,
            });
            console.log(tmp);
          } else {
            wx.showModal({
              title: '提示',
              content: '状态错误',
              showCancel: false,
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '订单获取错误',
            showCancel: false,
          })
        }
      }).catch(err => {
        console.log(err);
        wx.showModal({
          title: '提示',
          content: '获取错误',
          showCancel: false,
        })
      })
    }
    
  }


}