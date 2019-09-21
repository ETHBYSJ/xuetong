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
      this.$get('/v1/order/getList?size=100&page=' + page).then(data => {
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
            if (data.obj[i].order.orderType != undefined && data.obj[i].order.orderType!=null) {
              var title = data.obj[i].obj.activity == undefined ? ['', ''] : data.obj[i].obj.activity.heading.split('|', 2);
              var student = '';
              
              if (data.obj[i].obj.activityStudentList != undefined && data.obj[i].obj.activityStudentList.length > 2) {
                //console.log(data.obj[i].obj.activityStudentList);
                var stulist = data.obj[i].obj.activityStudentList.slice(2, -2).split('\",\"');
                for(let j in stulist) {
                  if (student.length < 10) {
                    student = student + stulist[j] + ' ';
                  } else if (stulist[j]!=undefined) {
                    student = student + '...';
                  }
                } 
              } else if (data.obj[i].obj.student != undefined){
                student = data.obj[i].obj.student.name;
              } else {
                student = '名字为空~'
              }
              //console.log(student);
              tmp.push({
                'id': data.obj[i].order.id,
                'orderType': data.obj[i].order.orderType,
                'createTime': data.obj[i].order.createTime.split(' ')[0],
                'activityHeading': title[0],
                'activityTitle': (title[1] == undefined ? '' : title[1]),
                //'activityStudent': student,
                'activityQuota': (data.obj[i].obj.activity == undefined ? null : data.obj[i].obj.activity.quota),
                'activityTitlePhoto': (data.obj[i].obj.activity == undefined ? null : data.obj[i].obj.activity.titlePhoto),
                'activityStatus': (data.obj[i].obj.activity == undefined ? null : data.obj[i].obj.activity.status),
                'activityRemains': (data.obj[i].obj.activity == undefined ? null : data.obj[i].obj.activity.remains),
                'activityId': (data.obj[i].obj.activity == undefined ? null : data.obj[i].obj.activity.id),
                'orderSn': data.obj[i].order.orderSn,
                //'status': data.obj[i].status,
                'payAmount': data.obj[i].order.payAmount,
                'showDetail': false,
                'heading': data.obj[i].order.heading,
                'note': data.obj[i].order.note,
                'studentName': student,
              });
            } else /*if (data.obj[i].status == '已支付')*/ {
              //console.log(data.obj[i])
            
            }
          }
          this.setData({
            'vo.orderList': tmp,
          });
          console.log(tmp);
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