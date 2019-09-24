let we = require('../../../we/index.js')
let QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
let demo = new QQMapWX({
  key: 'FJUBZ-LMP6D-WNE4G-HM6J6-JDFNH-FCFZ2' // 必填
});
new class extends we.Page {
    data() {
        return {
            po: {},
            vo: {
                'Currentcity': "",
                'imgBaseUrl': "",
                'infor': [],
                'pageNo': 1,
                'pageSize': 6,
                'total': "",
                'imgUrls': []
            },
          inputVal:"",
          selectaddress:"",
          myTimer: null,
          currentTab: 0,
          //焦点图banner
          mod: [
            'aspectFit',
            'widthFix',
          ],
          totalsize:"",
          leftMargin: '203rpx',
          rightMargin: '203rpx',
          currentImage: 0,
          currentIndex: 0,
        }
    }

    onShow() {        
      this.setData({
          page_Type: this.$app.pageType || ""
      })
      this.$app.pageType = "";
      this.loadBg()
      this.init()
    }

    onLoad(option) {
      this.$app.imgBaseUrl = 'https://xue.xuetong360.com'
      this.setData({
        option: option,
        'vo.imgBaseUrl': this.$app.imgBaseUrl
      }) 
      //获取城市 开始 可以在影院首页开始掉用//
      wx.getLocation({
        success: ({ latitude, longitude }) => {
          // 调用腾讯地图接口
          var that = this;
          demo.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function (res) {
              //let ad_infocity = res.result.address_component.province+res.result.address_component.city +   res.result.address_component.district+ ""
              // let ad_infocity = (res.result.address_component.city + "").split("市")[0]
              let ad_infocity = res.result.address_component.district + ""
              console.log(ad_infocity)
              that.$app.Currentcity = ad_infocity
              that.$app.CurrentcityLink = ad_infocity
              that.setData({
                'vo.Currentcity': that.$app.CurrentcityLink || ""
              })
            }
          });
        }
      })
             
    }

  //导航事件处理函数
  swichNav(e) {
    var current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current,
      page: 1,
    });
    this.init()
  }  

  jumpPage(e) {
    let item = e.currentTarget.dataset;
      wx.navigateTo({
        url: "../detail/detail?id=" + item.id
      })    
  }
  //跳转到已结束的活动页面
  jumpFinished(e) {
    let item = e.currentTarget.dataset;
    wx.navigateTo({
      url: "../detailFinished/detailFinished?id=" + item.id
    })  
  }   

  init() {
    let that = this;
    this.$get('/v1/activity/getActivityList?page=1&size=' + this.data.vo.pageSize + '&status=' + this.data.currentTab + '&keyword=' + this.data.inputVal +'&address='+this.data.selectaddress).then(data => {
      this.setData({
        "vo.pageNo": 1,
      });
      if (data.totalSize % data.pageSize != 0) {
        var totalsize = Math.ceil(data.totalSize / data.pageSize);
      } else {
        var totalsize = data.totalSize / data.pageSize;
      }
      this.setData({
        'vo.infor': data.obj,
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
  load(option) {
      if (option && option.url) {
          let str = "";
          option.data = JSON.parse(option.data)
          if (option.data.cinemaid) {
              wx.navigateTo({
                  url: '../../cinema/list/list?cinemaid=' + option.data.cinemaid + "&Cinname=" + option.data.Cinname + "&url=" + option.url + "&id=" + option.data.id
              })
          } else {
              wx.reLaunch({
                  url: `/pages/movie/index/index?url=` + option.url + "&data=" + JSON.stringify(option.data)
              })
              /*for (let key in option.data) {
        str && (str += "&")
        str += key + "=" + option.data[key]
      }
              wx.navigateTo({
                  url: '../../../' + option.url + "?" + str
              })*/
          }
      }
      this.setData({
          'vo.Currentcity': this.$app.CurrentcityLink,
      })
      this.DistrictList()
      this.loadBg()
  }
  //手动确认城市
  handsetCity() {
      let that = this
      if (this.data.userLocation === false) {
          wx.showModal({
              title: '提示',
              content: "当前无法定位到您的位置，请手动选择！",
              showCancel: false,
              success: function() {
                  wx.navigateTo({
                      url: "../../cinema/search/search?mark=1"
                  })
              }
          })
      } else {
          wx.showModal({
              title: '提示',
              content: "请允许该小程序获取您的地理位置，否则无法为您提供更好的服务",
              showCancel: false,
              success: function() {
                  wx.openSetting({
                      success: function(res) {
          
                          let userLocation = res.authSetting["scope.userLocation"]
                          that.setData({
                              userLocation: userLocation ? userLocation : false
                          })
                      }
                  })
              }
          })
      }

  }

  loadBg() {
    return this.$get("/v1/activity/getActivityCarousel").then(data => {
          this.setData({
              'vo.imgUrls': data.obj.content
          })
      }).catch(err => {
          this.$showModal({
              title: '获取轮播图列表错误',
              content: err.message,
              showCancel: false
          })
      })
  }
   
  //tab栏
  switchSlider1(e) {
      this.setData({
          'selectadd': e.target.dataset.add
      })
  }

  showInput() {
      this.setData({
          inputShowed: true
      });
  }

  hideInput() {
      this.setData({
          inputVal: "",
          inputShowed: false
      })
    this.myTimer()
  }

  clearInput() {
      this.setData({
          inputVal: ""
      });
      this.myTimer()
  }

  inputTyping(e) {
      this.setData({
          inputVal: e.detail.value
      });
      this.myTimer()
  }
  myTimer() {
      let that = this
      if (this.data.myTimer) {
          clearTimeout(this.data.myTimer)
          that.setData({
              myTimer: null
          })
      }
      this.setData({
          myTimer: setTimeout(function() {
              that.init()
              that.setData({
                  myTimer: null
              })
          }, 300)
      })
  }

  //点击城市
  Currentcity() {
      wx.navigateTo({
          url: "../search/search?Currentcity=" + this.data.vo.Currentcity
      })
  }

  //预览图片
  imgPreview(e) {
    let src = e.currentTarget.dataset.src;
    //暂时只允许浏览当前一张图片
    wx.previewImage({
      current: src,
      urls: [this.data.vo.imgBaseUrl + src],
    })
    
  }
  handleChange(e) {
    this.setData({
      currentImage: e.detail.current,
    })
  }
  toLeft(e) {
    let length = e.currentTarget.dataset.length
    this.setData({
      currentIndex: (this.data.currentImage + length - 1) % length,
    })
  }
  toRight(e) {
    let length = e.currentTarget.dataset.length
    this.setData({
      currentIndex: (this.data.currentImage + length + 1) % length,
    })
  }
  upper() {
    wx.showNavigationBarLoading()
    this.init()
    setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
  }

  lower(e) {
    wx.showNavigationBarLoading()
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
    let page = this.data.vo.pageNo + 1;
    if(page <= this.data.totalsize) {
      this.setData({
        "vo.pageNo": page,
      })
      this.$get('/v1/activity/getActivityList?page=' + page + '&size=' + this.data.vo.pageSize + '&status=' + this.data.currentTab + '&keyword=' + this.data.inputVal + '&address=' + this.data.selectaddress).then(data => {
        this.setData({
          "vo.infor": this.data.vo.infor.concat(data.obj)
        })
        setTimeout(function () {
          wx.showToast({
            title: '加载成功',
            icon: 'success',
            duration: 2000
          })
        }, 500)
      }).catch(err => {
        this.$showModal({
          title: '出错',
          content: '加载活动数据出错',
          showCancel: false
        })
      })
    }    
  }
}