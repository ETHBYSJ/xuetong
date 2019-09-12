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
      page: 1,
      totalsize: "",
      size: 6,
      userType: '',
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
      'userType': this.$app.userType
    })
    this.getData()
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
    this.$get('/v1/weeklyreport/getList?id='+id).then(data => {
      if(data.msg='SUCC') {
        this.setData({
          'totalsize': data.totalSize,
          'feed': data.obj,
        })
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
  }

  bindToNew() {
    let url = '/pages/member/newStudy/newStudy?id=' + this.data.studentid + '&name=' + this.data.name + '&img=' + this.data.img;
    wx.navigateTo({
      url: url,
    })
  }

  upper() {
    wx.showNavigationBarLoading()
    this.getData()
    console.log("upper")
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  }

  lower(e) {
    wx.showNavigationBarLoading()
    var that = this;
    setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
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