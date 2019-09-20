let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      po: {
      },
      /*
      vo: {
        orderList: [],
      },
      */
      orderList: [],
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
    //console.log("lower")
  }

  bindShowActivity() {

  }

  bindShowClazz(e) {
    this.$get('/v1/order/' + e.currentTarget.dataset.id).then(res=> {
      console.log(res)
    })//e.currentTarget.dataset.id
  }

  bindShowDetails(e) {
    var index = 'vo.orderList[' + e.currentTarget.dataset.idx +'].showDetail';
    this.setData({
      [index]: (this.data.vo.orderList[e.currentTarget.dataset.idx].showDetail? false : true),
    });
    console.log(this.data.vo.orderList[e.currentTarget.dataset.idx]);
  }

  getOrderList() {
    if (this.data.nextload == true) {
      var page = this.data.pageNo + 1;
      this.$get('/v1/order/getOrderList?size=100&page=' + page + '&status=全部').then(data => {
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
            if (data.obj[i].orderType != undefined && data.obj[i].orderType!=null) {
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
                'id': data.obj[i].id,
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
            'vo.orderList': tmp,
          });
          //console.log(this.data.vo.orderList);
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