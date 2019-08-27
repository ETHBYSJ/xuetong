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
    }
  }

  onLoad(options) {
    //console.log(options)
    this.setData({
      studentid: options.studentid,
      name: options.name,
      imgBaseUrl: this.$app.imgBaseUrl,
    })
    console.log(this.data.imgBaseUrl)
  }
  onShow() {
    /*
    this.$get('/v1/homework/getHomeworkList?studentId=2&page=1&size=2').then(data => {
      console.log(data)
    })
    */
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
    this.$get('/v1/homework/getHomeworkList?page=1&size=' + this.data.size + '&studentId=' + this.data.studentid).then(data => {
      console.log(data)      
      //console.log(data.obj)
      //检查今日是否上传
      if(data.obj.length > 0 && data.obj[0].createdate == this.data.nowday) {
        //今日作业已经上传
        this.setData({
          uploadtoday: true,
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
    console.log("...")
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 4000
    })
    var page = this.data.page + 1
    console.log(page)
    this.$get('/v1/homework/getHomeworkList?page=' + page + '&size=' + this.data.size + '&studentId=' + this.data.studentid).then(data => {
      if(data.obj.length > 0) {
        this.setData({
          page: page,          
        })
        //按日期排序
        /*
        data.obj.sort(function (a, b) {
          if (a.createdate == b.createdate) {
            return 0
          }
          else if (a.createdate < b.createdate) {
            return 1
          }
          else {
            return -1
          }
        })
        */
        this.setData({
          feed: this.data.feed.concat(data.obj)
        })
        console.log(this.data.feed)
        setTimeout(function () {
          wx.showToast({
            title: '加载成功',
            icon: 'success',
            duration: 2000
          })
        }, 500)
      }
    })
    
  }

  scrollTop() {
    //console.log("scrollTop")
    this.setData({
      scrolltop: 0,
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
  
  upload() {
    console.log("upload")
    wx.navigateTo({
      url: "../upload/upload"
    })
  }
  //预览图片
  imgPreview(e) {
    let src = e.currentTarget.dataset.src;
    //let index = e.currentTarget.dataset.index;
    //let photos = this.data.vo.infor[index].photos;
    //let imgList = [];
    //console.log(photos)
    /*
    for (let i = 0; i < photos.length; i++) {
      imgList.push(this.data.vo.imgBaseUrl + photos[i].photo_path);
    }
    */
    wx.previewImage({
      current: src,
      urls: imgList
    })
  }
  /*
  send() {
    var that = this
    console.log(wx.getStorageSync("__session__"))
    wx.uploadFile({
      url: that.data.imgBaseUrl + '/v1/homework/upload',
      filePath: '/images/default.jpg',
      name: 'file',
      header: {
        'Content-Type': 'application/json',
        //'X-Session-Token': wx.getStorageSync("__session__"),
      },
      success(res) {
        console.log(res)
      }
    })
  }
  */
}