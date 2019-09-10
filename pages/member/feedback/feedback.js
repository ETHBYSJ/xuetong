let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      studentid: "",
      img: "",
      name: "",
      feed: [],
      page: 1,
      totalsize: "",
      size: 6,
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
    this.getData()
  }

  showDetails(e) {
    let url="/pages/member/studentStudy/studentStudy?id="+e.target.dataset.id+"&studentid="+this.data.studentid+"&name="+this.data.name;
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
      } else {
        wx.showModal({
          title: '提示',
          content: '获取学情列表失败',
          showCancel: false
        })
      }
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
}