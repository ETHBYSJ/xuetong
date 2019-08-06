let we = require('../../../we/index.js')
let QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
let demo = new QQMapWX({
  key: 'FJUBZ-LMP6D-WNE4G-HM6J6-JDFNH-FCFZ2' // 必填
});

new class extends we.Page {

  /**
   * 页面的初始数据
   */
  data(){
    return{
      po: {},
      vo: {
        'cinemaDetails':"",
        'CarouselDetails':"",
        'imgBaseUrl': "",
        'roomList': [],
        'Wantseeimage': "/assets/icon/heart-fill.png"
      },
      page: 1,
      size: 12,
      'bannerHeight':""
     
    
    }
    
  }

  onLoad(options) {
    console.log(options.gradeid);
    this.setData({
      //'vo.imgBaseUrl': 'https://www.xuetong360.com',
	  'vo.imgBaseUrl': 'https://xue.xuetong360.com',
	  //'vo.imgBaseUrl': 'https://localhost',
      'vo.cinemaid': options.gradeid,
    })
    this.loadCarousel(this.data.vo.cinemaid)
    this.roomList(this.data.vo.cinemaid)
    this.cinemaDetail(this.data.vo.cinemaid)
  }
  //获取轮播图
  loadCarousel(id){
    this.$get('/v1/school/getSchoolCarousel?school=' + id).then(data => {
      console.log(data.obj);
      this.setData({
        'vo.CarouselDetails': data.obj,
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
  //获取机构详情
  cinemaDetail(id){
    this.$get('/v1/school/getSchoolInfo?school='+id).then(data => {
      console.log(data.obj);
      this.setData({
        'vo.cinemaDetails': data.obj,
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

  //获取机构相册列表
  roomList(id) {
   this.$get(
     '/v1/photoalbum/getPhotoAlbumList?type=rtGrade&id=' + id + '&page=' +this.data.page+ '&size=' + this.data.size).then(data => {
      
      let imgList=[];
      for(var i=0;i<data.obj.length;i++){
        var imgpath = this.data.vo.imgBaseUrl + data.obj[i].photoPath;
        console.log(imgpath)
        imgList.push(imgpath);
      }

      this.setData({
        'vo.roomList': imgList,
        'vo.roomtotal': data.totalSize
      })
       console.log(this.data.vo.roomList);
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
  //评论图片
  imgYu(e) {
    let src = e.currentTarget.dataset.src;
    let imgList = e.currentTarget.dataset.list;
    console.log(imgList);
    wx.previewImage({
      current: src,
      urls: imgList
    })
  }

  //焦点图
  imageLoad(e) {
   /* var res = wx.getSystemInfoSync();
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;*/
    this.setData({
      bannerHeight: 240
    });
  }
  //打开地图
  openMap(){
    let that=this;
    let latitude, longitude;
    //根据门店地址获取经纬度
    demo.geocoder({
      address: this.data.vo.cinemaDetails.address,
      success: function (res) {
        latitude = res.result.location.lat;
        longitude = res.result.location.lng;
        wx.getLocation({
          type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
          success: function (res) {
        // success 
            console.log(res.latitude + "/" + res.longitude);
            wx.openLocation({
              latitude: latitude, // 纬度，范围为-90~90，负数表示南纬 
              longitude: longitude, // 经度，范围为-180~180，负数表示西经
              scale: 14, // 缩放比例
              name: that.data.vo.cinemaDetails.name
        })
      }, fail: function (e) {
        //调用授权接口
        wx.openSetting({
          success: (res) => {
            /* res.authSetting = {
               "scope.userInfo": true,
               "scope.userLocation": true
             }*/
          }
        });
        console.log(e);
      }
    })
      },

    });

  }

  calling() {
    let that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.vo.cinemaDetails.phone,   
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  }  

 //预约
  Wantsee(e) {
  //  this.$get("/v1/movie/wantSee/" + e.currentTarget.dataset.info).then(data => {
      var that = this;
      if (that.data.Wantseecss == "on") {
        this.setData({
          "vo.Wantseeimage": "/assets/icon/heart-fill.png",
          Wantseecss: ""
        })
        wx.showToast({
          title: '已取消点赞',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      } else {
        this.setData({
          "vo.Wantseeimage": "/assets/icon/heart-fill1.png",
          Wantseecss: "on"
        })
        wx.showToast({
          title: '已添加点赞',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
 /*   }).catch(err => {
      this.$showModal({
        title: '加入想看接口出错',
        content: err.message,
        showCancel: false
      })
    })*/
  }


  //分享给朋友
  onShareAppMessage(res) {
    return {
      title: this.data.vo.cinemaDetails.name,
      path: 'pages/school/list/list?gradeid=' + this.data.vo.cinemaid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }






}


