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
      studentid: studentid,
      img: options.img,
      name: options.name,
    })
  }
  onShow() {
    this.getData()
  }
  getData() {
    //得到学情列表
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