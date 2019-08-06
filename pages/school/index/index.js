let we = require('../../../we/index.js')
let QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
let demo = new QQMapWX({
  key: 'FJUBZ-LMP6D-WNE4G-HM6J6-JDFNH-FCFZ2' // 必填
});


new class extends we.Page {
  data() {
    return {
      po: {
        'cityCode': "",
      },
      vo: {
        'Currentcity': "",
        'imgBaseUrl': "",
        'Cinemalist': "",
        'DistrictList': "",
        'sortingList': "",
        'pageNo': 1,
        'pageSize': 10,
        'total': "",
        'imgUrlsHeight': "",
        'imgUrls': [
          { picUrl:"/images/banner_2.jpg"},
          { picUrl:"/images/banner_3.jpg"},
          { picUrl:"/images/banner_4.jpg"}
          ],
      },
      sortType: "",
      sortFilterValue: "",
      inputShowed: false,
      inputVal: "",
      activeSortingName: "品牌 ",
      DistrictSortingName: "特色",
      districtChioceIcon: "/assets/icon/icon-go-black.png",
      sortingChioceIcon: "/assets/icon/icon-go-black.png",
      activeSortingNameColor: "#1296db",
      activeSortingNameColor1: "#1296db",
      activeColor: "989cb7",
      DistrictColor: "#1296db",

      //焦点图banner
      mod: [
        'aspectFit',
        'widthFix',
      ],
      add: 4,
      selectadd: 0,
      odd: 4,
      selectodd: 0,
    }
  }

  onLoad(options) {
    console.log(options);
    //判断是否分享进入
    if (options.share_query) {
      setTimeout(function () {
        wx.hideLoading()
        wx.navigateTo({
          url: '/pages/school/list/list',
        })
      }, 500)
    } 
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
            let ad_infocity = res.result.address_component.province + res.result.address_component.city + res.result.address_component.district + ""
            that.$app.Currentcity = ad_infocity
            that.$app.CurrentcityLink = ad_infocity
            that.setData({
              'vo.Currentcity': that.$app.CurrentcityLink
            })
          }
        });
      }
    })
    //获取城市 结束//  

  /* this.setData({
      'vo.imgBaseUrl': this.$app.imgBaseUrl
    })*/
    
  //  this.loadBg()
  //  this.cityData()
  //  this.DistrictList()
  //  this.sortingList()
    this.Cinemalist()
  }

 /* loadBg() {
    return this.$get("/v1/movie/carousel").then(data => {
      this.setData({
        'vo.imgUrls': data.obj
      })
    }).catch(err => {
      this.$showModal({
        title: '获取轮播图列表错误',
        content: err.message,
        showCancel: false
      })
    })
  }*/
  //获取特色
/*  DistrictList() {
    this.$get('/v1/cinema/tsList').then(data => {
      this.setData({
        'vo.DistrictList': data.obj,
      })
    }).catch(err => {
      if (err) {
        this.data.vo.coderesult = err
        this.$showModal({
          title: '提示',
          content: `${err.message}`,
          showCancel: false
        })
      } else {
        this.$showModal({
          title: '提示',
          content: err.msg,
          showCancel: false
        })
      }
    })
  }*/

  //获取品牌
 /* sortingList() {
    this.$get('/v1/cinema/phList').then(data => {
      this.setData({
        'vo.sortingList': data.obj,
      })
    }).catch(err => {
      if (err) {
        this.data.vo.coderesult = err
        this.$showModal({
          title: '提示',
          content: `${err.message}`,
          showCancel: false
        })
      } else {
        this.$showModal({
          title: '提示',
          content: err.msg,
          showCancel: false
        })
      }
    })
  }*/

  //获取城市拼音
 /* cityData() {
    this.$get('/v1/cinema/city?searchName=' + this.data.vo.Currentcity).then(data => {
      this.setData({
        'po.cityCode': data.obj[0].code
      })
      this.Cinemalist()
    }).catch(err => {
      if (err) {
        this.data.vo.coderesult = err
        this.$showModal({
          title: '提示',
          content: `${err.message}`,
          showCancel: false
        })
      } else {
        this.$showModal({
          title: '提示',
          content: err.msg,
          showCancel: false
        })
      }
    })
  }*/

  //获取机构列表
  Cinemalist() {
    this.$get('v1/school/getAllSchoolInfo').then(data => {
      this.setData({
        'vo.Cinemalist': data.obj,
        'vo.total': data.totalSize
      })
    }).catch(err => {
      if (err) {
        this.data.vo.coderesult = err
        this.$showModal({
          title: '提示',
          content: `${err.message}`,
          showCancel: false
        })
      } else {
        this.$showModal({
          title: '提示',
          content: err.msg,
          showCancel: false
        })
      }
    })
  }

  //焦点图
  imageLoad(e) {
    var res = wx.getSystemInfoSync();
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    this.setData({
      bannerHeight: res.windowWidth / ratio,
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
  }

  clearInput() {
    this.setData({
      inputVal: ""
    });
  }

  inputTyping(e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.Cinemalist()
  }

  //点击城市
  Currentcity() {
    wx.navigateTo({
      url: "../search/search?Currentcity=" + this.data.vo.Currentcity
    })
  }

  //条件选择
 /* choiceItem(e) {
    switch (e.currentTarget.dataset.item) {
      case "1":
        if (this.data.chioceSortings) {
          this.setData({
            districtChioceIcon: "/assets/icon/icon-go-black.png",
            sortingChioceIcon: "/assets/icon/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            activeSortingNameColor: "#989cb7",
            activeSortingNameColor1: "#989cb7",
            activeColor: "#989cb7",
            DistrictColor: "#989cb7",
          });
        }
        else {
          this.setData({
            districtChioceIcon: "/assets/icon/icon-go-black.png",
            sortingChioceIcon: "/assets/icon/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            activeSortingNameColor: "#ff6600",
            activeSortingNameColor1: "#989cb7",
            activeColor: "#989cb7",
            DistrictColor: "#989cb7",
            sortType: "pf",
            sortFilterValue: "",
            activeSortingName: "品牌 ",
            DistrictSortingName: "特色",
          });
          this.Cinemalist()
        }
        break;
      case "2":
        if (this.data.chioceSorting) {
          this.setData({
            districtChioceIcon: "/assets/icon/icon-go-black.png",
            sortingChioceIcon: "/assets/icon/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            activeSortingNameColor: "#989cb7",
            activeSortingNameColor1: "#989cb7",
            activeColor: "#989cb7",
            DistrictColor: "#989cb7"
          });
        }
        else {
          this.setData({
            districtChioceIcon: "/assets/icon/icon-go-black.png",
            sortingChioceIcon: "/assets/icon/icon-down-black.png",
            chioceDistrict: false,
            chioceSorting: true,
            activeSortingNameColor: "#989cb7",
            activeSortingNameColor1: "#989cb7",
            activeColor: "#ff6600",
            DistrictColor: "#989cb7",
            sortType: "ph",
            sortFilterValue: ""
          });
        }
        break;

      case "3":
        if (this.data.chioceDistricts) {
          this.setData({
            districtChioceIcon: "/assets/icon/icon-go-black.png",
            sortingChioceIcon: "/assets/icon/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            activeSortingNameColor: "#989cb7",
            activeSortingNameColor1: "#989cb7",
            activeColor: "#989cb7",
            DistrictColor: "#989cb7"
          });
        }
        else {
          this.setData({
            districtChioceIcon: "/assets/icon/icon-go-black.png",
            sortingChioceIcon: "/assets/icon/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            activeSortingNameColor: "#989cb7",
            activeSortingNameColor1: "#ff6600",
            activeColor: "#989cb7",
            DistrictColor: "#989cb7",
            sortType: "zj",
            sortFilterValue: "",
            activeSortingName: "品牌 ",
            DistrictSortingName: "特色",
          });
          this.Cinemalist()
        }
        break;
      case "4":
        if (this.data.chioceDistrict) {
          this.setData({
            districtChioceIcon: "/assets/icon/icon-go-black.png",
            sortingChioceIcon: "/assets/icon/icon-go-black.png",
            chioceDistrict: false,
            chioceSorting: false,
            activeSortingNameColor: "#989cb7",
            activeSortingNameColor1: "#989cb7",
            activeColor: "#989cb7",
            DistrictColor: "#989cb7"
          });
        }
        else {
          this.setData({
            districtChioceIcon: "/assets/icon/icon-down-black.png",
            sortingChioceIcon: "/assets/icon/icon-go-black.png",
            chioceDistrict: true,
            chioceSorting: false,
            activeSortingNameColor: "#989cb7",
            activeSortingNameColor1: "#989cb7",
            activeColor: "#989cb7",
            DistrictColor: "#ff6600",
            sortType: "ts",
            sortFilterValue: ""
          });
        }
        break;
    }
  }*/

  //排序
  selectSorting(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      districtChioceIcon: "/assets/icon/icon-go-black.png",
      chioceSorting: false,
      chioceDistrict: false,
      activeSortingIndex: index,
      activeSortingName: this.data.vo.sortingList[index].name,
      productList: [],
      pageIndex: 1,
      sortFilterValue: this.data.vo.sortingList[index].code,
      DistrictSortingName: "特色",
    })
    this.Cinemalist();
  }

  DistrictSorting(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      districtChioceIcon: "/assets/icon/icon-go-black.png",
      chioceSorting: false,
      chioceDistrict: false,
      activeSortingIndex: index,
      DistrictSortingName: this.data.vo.DistrictList[index].name,
      productList: [],
      pageIndex: 1,
      sortFilterValue: this.data.vo.DistrictList[index].code,
      activeSortingName: "品牌 "
    })
    this.Cinemalist();
  }

  /*上拉加载更多*/
  onReachBottom() {
    if ((this.data.vo.pageNo * this.data.vo.pageSize) < this.data.vo.total) {
      this.setData({
        'vo.pageNo': this.data.vo.pageNo + 1
      })
      this.Cinemalist()
    }
  }

}
