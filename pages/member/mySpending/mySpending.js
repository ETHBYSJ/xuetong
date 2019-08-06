let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      po: {},
      currentTab:'全部',
      page: 1,
      totalsize: "",
      size: 10,
      vo: {
        infor: []
      }
    }
  }
  onLoad() {
   this.$get('/v1/order/getOrderList?page='+this.data.page+'&size='+this.data.size+'&status=全部').then(data => {
      this.setData({
        'vo.infor': data.obj.content
      })
    }).catch(err => {
      this.$showModal({
        title: '获取订单列表错误',
        content: err.msg,
        showCancel: false
      })
    })
  }

  //导航事件处理函数
  swichNav(e) {
    var current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current,
      page: 1,
    });
    this.$get('/v1/order/getOrderList?page=1&size=10&status=' + this.data.currentTab).then(data => {
      console.log(data);
      if (data.totalSize % data.pageSize != 0) {
        var totalsize = Math.ceil(data.totalSize / data.pageSize);
      } else {
        var totalsize = data.totalSize / data.pageSize;
      }
      this.setData({
        'vo.infor': data.obj.content,
        totalsize: totalsize,
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })

  }  

  //使用本地 fake 数据实现继续加载效果
  nextLoad() {
    if (this.data.page != this.data.totalsize) {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 4000
      })
      var page = this.data.page + 1;
      console.log(page);
      this.setData({
        page: page,
      })
      this.$get('/v1/order/getOrderList?page=' + this.data.page +'&size=10&status=' + this.data.currentTab).then(data => {
        this.setData({
          'vo.infor': data.obj.content,
          'vo.infor': this.data.vo.infor.concat(data.obj.content),
        })
      }).catch(err => {
        this.$showModal({
          title: '获取信息错误',
          content: err.msg,
          showCancel: false
        })
      })
      setTimeout(function () {
        wx.showToast({
          title: '加载成功',
          icon: 'success',
          duration: 2000
        })
      }, 500)
    }
  }

  lower(e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    console.log("lower")
  }

  //事件处理函数
  bindItemTap(e) {
    var noticeid = e.currentTarget.dataset.type;
    if (noticeid){
      wx.navigateTo({
        url: '../../answer/answer?noticeid=' + noticeid,
      })
    }else{
      this.$showModal({
        title: '获取信息错误',
        content: '该通知已被删除',
        showCancel: false
      })
    }
   
  }


}