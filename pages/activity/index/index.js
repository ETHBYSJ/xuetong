let we = require('../../../we/index.js')

new class extends we.Page {
    data() {
        return {
            po: {},
            vo: {
                'Currentcity': "",
                'imgBaseUrl': "",
                'infor': [],
                'pageNo': 1,
                'pageSize': 10,
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
        }
    }

    onShow() {
        //console.log(option)
        this.setData({
            page_Type: this.$app.pageType || ""
        })
        this.$app.pageType = "";
            this.setData({
                'vo.Currentcity': this.$app.CurrentcityLink || ""
            })
            this.loadBg()
            this.init()
    }

    onLoad(option) {
        this.setData({
            option: option,
            'vo.imgBaseUrl': this.$app.imgBaseUrl
          })
        
    }


  //导航事件处理函数
  swichNav(e) {
    var current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current,
      page: 1,
    });
    console.log(this.data.currentTab)
     this.init()

  }  

  jumpPage(e) {
    let item = e.currentTarget.dataset;
      wx.navigateTo({
        url: "../detail/detail?id=" + item.id
      })
    
  }

   



    init() {
        let that = this
      console.log(this.data.inputVal=="")
      console.log(this.data.selectaddress=="")
      console.log('/v1/activity/getActivityList?page=1&size=10&status=' + this.data.currentTab + '&keyword=' + this.data.inputVal + '&address=' + this.data.selectaddress)
      this.$get('/v1/activity/getActivityList?page=1&size=10&status=' + this.data.currentTab + '&keyword=' + this.data.inputVal +'&address='+this.data.selectaddress).then(data => {
      console.log(data);
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
        console.log(option)
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
                            console.log(res)
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
            console.log(data)
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

   
    /*上拉加载更多*/
    onReachBottom() {
        if (this.data.sortType == "zj") {
            return false;
        }
        if ((this.data.vo.pageNo * this.data.vo.pageSize) < this.data.vo.total) {
            this.setData({
                'vo.pageNo': this.data.vo.pageNo + 1
            })
            this.Cinemalist(true)
        }
    }
    //浏览图片
  imgYu(e) {
    let src = e.currentTarget.dataset.src;
    let index = e.currentTarget.dataset.index;
    let photos = this.data.vo.infor[index].photos;
    let imgList=[];
    console.log(photos)
    for(let i=0;i<photos.length;i++){
     imgList.push(this.data.vo.imgBaseUrl + photos[i].photo_path);
    }
    wx.previewImage({
      current: src,
      urls: imgList
    })
  }
}