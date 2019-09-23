let we = require('../../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      studentid: "",
      name: "",
      imgBaseUrl: "",
      feed: [],
      page: 1,
      size: 2,
      totalsize: "",
      uploadtoday: false,
      nowday: "",
      //作业id
      id: "",
    }
  }

  onLoad(options) {
    this.setData({
      studentid: options.studentid,
      name: options.name,
      imgBaseUrl: this.$app.imgBaseUrl,
    });
  }
  onShow() {
    var today = new Date()
    var year = today.getFullYear()
    var month = today.getMonth() + 1
    if (month >= 1 && month <= 9) {
      month = "0" + month
    }
    var day = today.getDate()
    if (day >= 0 && day <= 9) {
      day = "0" + day
    }
    today = year + "-" + month + "-" + day
    this.setData({
      nowday: today,
    })
    this.getData()
  }
  getData() {
    this.$get('/v1/homework/getList?page=1&size=' + this.data.size + '&id=' + this.data.studentid).then(data => {
      //检查今日是否上传
      if(data.obj.length > 0 && data.obj[0].homeworkDate == this.data.nowday) {
        //今日作业已经上传
        this.setData({
          uploadtoday: true,
          id: data.obj[0].id,
        })
      }
      else {
        //今日未上传作业
        this.setData({
          uploadtoday: false,
        })
      }
      this.setData({
        feed: data.obj,
        page: 1,
      })
    }).catch(err => {
      this.$showModal({
        title: '出错',
        content: err.msg,
        showCancel: false
      })
    })
  }

  upper() {
    wx.showNavigationBarLoading();
    this.getData();
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  }

  lower(e) {
    wx.showNavigationBarLoading();
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
  }

  //继续加载效果
  nextLoad() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 4000
    })
    var page = this.data.page + 1;
    this.$get('/v1/homework/getList?page=' + page + '&size=' + this.data.size + '&id=' + this.data.studentid).then(data => {
      if(data.obj.length > 0) {
        this.setData({
          page: page,          
        });       
        this.setData({
          feed: this.data.feed.concat(data.obj)
        });
        setTimeout(function () {
          wx.showToast({
            title: '加载成功',
            icon: 'success',
            duration: 2000
          })
        }, 500);
      }
    }).catch(err => {
      this.$showModal({
        title: '出错',
        content: err.msg,
        showCancel: false
      });
    })
    
  }

  scrollTop() {
    this.setData({
      scrolltop: 0,
    });
  }
  bindScroll(e) {
    if (e.detail.scrollTop > 100) {
      this.setData({
        hiddenScrollTop: false,
      });
    }
    else {
      this.setData({
        hiddenScrollTop: true,
      });
    }
  }
  
  upload() {
    wx.navigateTo({
      url: "../upload/upload?studentid=" + this.data.studentid + "&name=" + this.data.name + "&nowday=" + this.data.nowday + "&id=" + this.data.id,
    });
  }
  
  end() {
    wx.showModal({
      title: '',
      content: '拨打老师电话提前结束托管',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '',
          })
        }
      }
    });
  }
}