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
      nextload: true,
      scrolltop: 0,
    }
  }

  onLoad(options) {

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

  bindShowDetails(e) {
    var index = 'orderList[' + e.currentTarget.dataset.idx +'].showDetail';
    this.setData({
      [index]: (this.data.orderList[e.currentTarget.dataset.idx].showDetail? false : true),
    });
    console.log(this.data.orderList[e.currentTarget.dataset.idx]);
  }

  getOrderList() {
    if (this.data.nextload == true) {
      var page = this.data.pageNo + 1;
      this.$get('/v1/order/getOrderList?size=100&page=' + page + '&status=已支付').then(data => {
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
          var tmp = [];
          for (let i in data.obj) {
            if (true/*data.obj[i].status=='已支付'*/) {
              var title = data.obj[i].activityHeading == null ? ['', ''] : data.obj[i].activityHeading.split('|', 2);
              var student = ' ';
              if (data.obj[i].activityStudent != undefined) {
                if (data.obj[i].activityStudent.length > 13) {
                  student = data.obj[i].activityStudent.substr(0, 13) + ' ...';
                } else {
                  student = data.obj[i].activityStudent;
                }
              } 
              tmp.push({
                'id': (page - 1) * 10 + i,
                'orderType': data.obj[i].orderType,
                'createTime': data.obj[i].createTime.split(' ')[0],
                'activityHeading': title[0],
                'activityTitle': (title[1] == undefined ? '' : title[1]),
                'activityStudent': student,
                'activityQuota': data.obj[i].activityQuota,
                'activityTitlePhoto': data.obj[i].activityTitlePhoto,
                'activityStatus': data.obj[i].activityStatus,
                'activityRemains': data.obj[i].activityRemains,
                'activityId': data.obj[i].activityId,
                'orderSn': data.obj[i].orderSn,
                //'status': data.obj[i].status,
                'payAmount': data.obj[i].payAmount,
                'showDetail': false,
                'heading': data.obj[i].heading,
                'note': data.obj[i].note,
                'studentName': data.obj[i].studentName,
              });
            } else /*if (data.obj[i].status == '已支付')*/ {
              //console.log(data.obj[i])
            
            }
          }
          this.setData({
            orderList: tmp,
          });
          console.log(this.data.orderList);
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