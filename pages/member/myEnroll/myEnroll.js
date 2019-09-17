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
      action: options.action,
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
      this.$get('/v1/order/getOrderList?page=' + page).then(data => {
        //console.log(data)
        if (data.msg == 'SUCC') {
          //判断能否继续加载
          this.setData({
            'totalSize': data.totalSize,
            'page': page,
          })
          if (this.data.pageNo * 10 >= this.data.totalSize) {
            this.setData({
              'nextload': false,
            })
          }
          //数据处理
          var tmp = [];
          if (this.data.status == '全部') {
            for (let i in data.obj.content) {
              if (data.obj.content[i].orderType == 1) {
                tmp.push(data.obj.content[i]);
              }
            }
            this.setData({
              orderList: tmp,
            });
            console.log(tmp);
          } else if (this.data.status != null) {
            var tmp = [];
            for (let i in data.obj.content) {
              if (data.obj.content[i].status == this.data.status && data.obj.content[i].orderType == 1) {
                tmp.push(data.obj.content[i]);
              }
            }
            this.setData({
              orderList: tmp,
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