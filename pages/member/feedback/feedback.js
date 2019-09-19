let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      vo: {
        message: {},
        
      },
      studentid: "",
      img: "",
      name: "",
      feed: [],
      page: 0,
      totalSize: "",
      size: 10,
      userType: '',
      nextload: true,
    }
  }
  onLoad(options) {
    //console.log(options)
    this.setData({
      studentid: options.studentid,
      img: options.img,
      name: options.name,
    })
  }

  onShow() {
    this.setData({
      'userType': this.$app.userType,
      'page': 0,
      'nextload': true,
      'feed': [],
    })
    console.log('show feed')
    this.getData();
  }

  showDetails(e) {
    let url="/pages/member/studentStudy/studentStudy?id="+e.currentTarget.dataset.feedid+"&studentid="+this.data.studentid+"&name="+this.data.name+"&img="+this.data.img;
    //console.log(e)
    wx.navigateTo({
      url: url,
    })
  }

  getData() {
    //得到学情列表
    let id = parseInt(this.data.studentid);
    if (this.data.nextload == true) {
      var pagenum = this.data.page + 1;
      this.$get('/v1/weeklyreport/getList?id=' + id + '&page=' + pagenum).then(data => {
        console.log(data);
        if (data.msg = 'SUCC') {
          this.setData({
            'totalSize': data.totalSize,
            'feed': this.data.feed.concat(data.obj),
            'page': pagenum,
          })

          if (this.data.page * 10 >= this.data.totalSize) {
            this.setData({
              'nextload': false,
            })
          }
          //console.log(data.obj)
        } else {
          wx.showModal({
            title: '提示',
            content: '获取学情列表失败',
            showCancel: false
          })
        }
      }).catch(err => {
        this.$showModal({
          title: '获取信息错误',
          content: err.msg,
          showCancel: false
        })
      })
    } else {
      this.$showToast({
        title: '已经到底啦~',
        icon: 'success',
        duration: 1000
      })
    }
  }

  bindToNew() {
    let url = '/pages/member/newStudy/newStudy?id=' + this.data.studentid + '&name=' + this.data.name + '&img=' + this.data.img;
    wx.navigateTo({
      url: url,
    })
  }

  upper() {
    wx.showNavigationBarLoading();
  }

  lower(e) {
    wx.showNavigationBarLoading()
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.getData(); }, 1000);
    console.log("lower")
  }

  //继续加载效果
  nextLoad() {
    
  }

  loadTechInfo() {
    this.$get('/v1/teacher/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }

  loadInfo() {
    this.$get('/v1/family/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })
      if (data.obj.phone) {
        var tmp_phone = data.obj.phone;
        tmp_phone = tmp_phone.slice(0, 3) + "****" + tmp_phone.slice(7);
        this.setData({
          'vo.phone_display': tmp_phone,
        })
      } else {
        this.setData({
          'vo.phone_display': null,
        })
      }
      console.log(data);
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
}