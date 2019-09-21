//请假 页面
let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      studentid: "",
      img: '',
      name: "",
      feed: [],
      page: 1,
      totalsize: "",
      size: 5,
      hiddenScrollTop: true,
      confirmleave: {},
      sendername: "",
    }
  }
  onLoad(options) {
    //console.log(options)
    this.setData({
      studentid: options.studentid,
      img: options.img,
      name: options.name,
      leaveid: options.leaveid,
      sendername: options.sendername,
    })
  }
  onShow() {
    this.$get('/v1/askforleave/' + this.data.leaveid).then(res => {
      console.log(res.obj)
      this.setData({
        'confirmleave': res.obj,
        'confirm': res.obj.confirm,
      });
    })
    this.getData();
  }

  getData() {
    this.$get('/v1/askforleave/getList?id=' + this.data.studentid + '&page=1&size=' + this.data.size).then(data => {
      console.log(data)
      this.setData({
        totalsize: Math.ceil(data.totalSize / this.data.size)
      })

      this.setData({
        page: 1,
        feed: data.obj,
      })
    })
  }
  

  bindLeave(e) {
    //console.log(e)
    this.$get("v1/askforleave/confirm?id=" + e.currentTarget.dataset.leaveid).then(res => {
      if (res.obj == 'SUCC') {
        wx.showToast({
          title: '确认成功',
          icon: 'success',
          duration: 1000,
        });
        this.onShow();
        /*this.setData({
          'confirmleave': 1,
        });*/
      } else {
        wx.showModal({
          title: '提示',
          content: '确认错误',
        })
      }
    }).catch(err => {
      wx.showModal({
        title: '提示',
        content: '通信错误'+err.errMsg,
      });
    })
  }

  bindScroll(e) {
    //console.log(e)
    if (e.detail.scrollTop > 100) {
      this.setData({
        hiddenScrollTop: false,
      })
    }
    else {
      this.setData({
        hiddenScrollTop: true,
      })
    }
  }
  scrollTop() {
    //console.log("scrollTop")
    this.setData({
      scrolltop: 0,
    })
  }

  upper() {
    wx.showNavigationBarLoading()
    this.getData()
    //console.log("upper")
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  }
  lower(e) {
    wx.showNavigationBarLoading()
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
    //console.log("lower")
  }
  //继续加载效果
  nextLoad() {
    if (this.data.page != this.data.totalsize) {
      //console.log('...')
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 4000
      })
      var page = this.data.page + 1;
      //console.log(page);
      this.setData({
        page: page,
      })
      this.$get('/v1/askforleave/getList?id=' + this.data.studentid + '&page=' + this.data.page + '&size=' + this.data.size).then(data => {
        console.log(data)
        this.setData({
          //feed: this.data.feed.concat(next),
          feed: this.data.feed.concat(this.data.obj),
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
}

