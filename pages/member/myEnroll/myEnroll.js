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

  bindToOrder(e) {
    var idx = e.currentTarget.dataset.idx;
    //console.log(e)
    if (this.data.vo.orderList[idx].status == "arrearage") {
      var url = '../../activity/apply/apply?id=' + this.data.vo.orderList[idx].id + " & titlePhoto=" + this.data.imgBaseUrl + this.data.vo.orderList[idx].activityTitlePhoto + "&heading=" + this.data.vo.orderList[idx].activityHeading + "&remains=" + this.data.vo.orderList[idx].activityRemains + "&familyPrice=" + this.data.vo.orderList[idx].familyPrice + "&studentPrice=" + this.data.vo.orderList[idx].studentPrice + "&familyEnable=" + this.data.vo.orderList[idx].familyEnable + "& phone=" + this.data.vo.orderList[idx].phone;
      //console.log(url);
      wx.navigateTo({
        url: url,
      });
    } else {
      var url = '../../activity/payment/payment?id=' + this.data.vo.orderList[idx].id;
      wx.navigateTo({
        url: url,
      });
    }
    
  }
  

  getOrderList() {
    if (this.data.nextload == true) {
      var page = this.data.pageNo + 1;
      var url = '';
      if (this.data.status == 'all') {
        url = '/v1/order/getList?page=' + page + '&type=1';
      } else {
        url = '/v1/order/getList?page=' + page + '&status=' + this.data.status + '&type=1';
      }
      this.$get(url).then(data => {
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
          for (let i in data.obj) {
            tmp.push({
              'id': data.obj[i].order.id,
              'activityHeading': data.obj[i].obj.activity.heading,
              'activityQuota': data.obj[i].obj.activity.quota,
              'activityTitlePhoto': data.obj[i].obj.activity.titlePhoto,
              'activityStatus': data.obj[i].obj.activity.status,
              'activityRemains': data.obj[i].obj.activity.remains,
              'activityId': data.obj[i].obj.activity.id,
              'orderSn': data.obj[i].order.orderSn,
              'status': data.obj[i].order.status,
              'payAmount': data.obj[i].order.payAmount,
              'studentPrice': data.obj[i].obj.activity.studentPrice,
              'familyPrice': data.obj[i].obj.activity.familyPrice,
              'familyEnable': data.obj[i].obj.activity.familyEnable,
              'phone': data.obj[i].obj.activity.phone,
            });
          }
        }
        this.setData({
          'vo.orderList': tmp,
        });
        console.log(tmp);
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

  lower(e) {
    wx.showNavigationBarLoading()
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.getOrderList(); }, 1000);
    console.log("lower")
  }

}