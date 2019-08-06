let we = require('../../we/index.js');
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let demo = new QQMapWX({
  key: 'FJUBZ-LMP6D-WNE4G-HM6J6-JDFNH-FCFZ2' // 必填
});

new class extends we.Page {
  data() {
    return {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      noticeid:""

    }
  }

  onLoad(options) {
    if (options.noticeid){
      this.setData({
        noticeid: options.noticeid
      })
    }
   
    let oldSession = wx.getStorageSync("__session__")
    wx.removeStorageSync("__session__")
    if (oldSession) {
      wx.setStorageSync("__session__", oldSession)
    }
    this.$getSession().then(sid => {
      this.getUserStatus();
    });

    //图片默认路径
  	//this.$app.imgBaseUrl = 'https://www.xuetong360.com'
 	this.$app.imgBaseUrl = 'https://xue.xuetong360.com'
 	//this.$app.imgBaseUrl = 'https://localhost'
    //获取城市 开始 可以在影院首页开始掉用//
    wx.getLocation({
      success: ({ latitude, longitude }) => {
        // 调用腾讯地图接口
        var that=this;
        demo.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
            },
          success: function (res) {
            //let ad_infocity = res.result.address_component.province+res.result.address_component.city +   res.result.address_component.district+ ""
           // let ad_infocity = (res.result.address_component.city + "").split("市")[0]
            let ad_infocity = res.result.address_component.district + ""
            that.$app.Currentcity = ad_infocity
            that.$app.CurrentcityLink = ad_infocity
          }
        });
      }
    })
    //获取城市 结束//  
  }

  /*获取用户状态信息*/
  getUserStatus() {
    var that=this
    wx.login({
      success : function(res) {
        if (res.code) {
          //发起网络请求
          console.log('登录成功！' + res.code);
          that.getUserStatusByLogin(res.code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  }
  getUserStatusByLogin(jsCode) {
    var that = this
    this.$get('/v1/session/fetchLoginStatus/'+jsCode).then(data => {
      that.$app.userdtatus = data.obj;
      switch (data.obj) {
        case 101://101未上传粉丝信息
          //新版本不能直接调用wx.getUserInfo()了
          // this.postUserInfo()
          //这里显示funclist.wxml页面进行button授权.
         // wx.reLaunch({ url: `/pages/activity/index/index` })
          break
        case 102://未注册用户
          //wx.reLaunch({ url: `/pages/school/index/index` })
          //跳到注册页面
          wx.reLaunch({ url: `/pages/activity/index/index` })
          break
        case 103://进入影视首页
          wx.reLaunch({ url: `/pages/activity/index/index?noticeid=` + this.data.noticeid})
          break

        default:
          wx.removeStorageSync("__session__")
          this.$getSession().then(sid => {
            this.getUserStatus();
          });
          break;
      }
    }).catch(err => {
      wx.removeStorageSync("__session__")
      this.$getSession().then(sid => {
        this.getUserStatus();
      });
    })
  }

  bindGetUserInfo(e) {
    wx.reLaunch({ url: `/pages/activity/index/index`})
    this.postUserInfo()
  }

  /*插入粉丝数据*/
  postUserInfo() {
    this.$login().then(res => {
      if (res.code) {
        this.$getUserInfo({
          withCredentials: true,
          lang: 'zh_CN'
        }).then(data => {
          return this.$post("/v1/session/addWechatFansInfo", {
            //"jsCode": res.code,
            "name": data.userInfo.nickName,
            "sex": data.userInfo.gender, //性别
            "city": data.userInfo.city, //所在城市
            "province": data.userInfo.province, //所在省份
            "country": data.userInfo.country, //所在国家
            "imgUrl": data.userInfo.avatarUrl,
            "encryptedData": data.encryptedData,
            "iv": data.iv
          }).then(data => {
            this.getUserStatus()
          })
        }).catch(err => {
          this.$showModal({
            title: '提示',
            content: "请允许该小程序使用用户数据，否则无法进行下一步",
            showCancel: false
          }).then(result => {
            this.$openSetting().then(setting => {
              if (setting.authSetting["scope.userInfo"]) {
                this.postUserInfo()
              } else {
                this.postUserInfo()
              }
            })
          })
        })
      } else {
        this.$showModal({
          title: '提示',
          content: '获取用户登录态失败！' + res.errMsg,
          showCancel: false
        })
      }
    }).catch(err => {
      this.$showModal({
        title: '调用微信登录接口失败',
        content: err.message,
        showCancel: false
      })
    })

  }

}