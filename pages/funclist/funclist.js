let we = require('../../we/index.js');


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
        //101未上传粉丝信息
        case 101:
          //新版本不能直接调用wx.getUserInfo()了
          // this.postUserInfo()
          //这里显示funclist.wxml页面进行button授权.
         // wx.reLaunch({ url: `/pages/activity/index/index` })
          break
        //未注册用户
        case 102:
          //跳到注册页面
          wx.reLaunch({ url: `/pages/member/MemberCenter/MemberCenter` });
          break
        //进入影视首页
        case 103: //不可能，爬
          //wx.reLaunch({ url: `/pages/activity/index/index?noticeid=` + this.data.noticeid})
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
    this.postUserInfo();
  }

  /*插入粉丝数据*/
  postUserInfo() {
    //console.log(this.$app.userdtatus)
    this.$login().then(res => {
      console.log('kaiqi0')
      if (res.code) {
        this.$getUserInfo({
          withCredentials: true,
          lang: 'zh_CN',
        }).then(data => {
          console.log('kaiqi')
          return this.$post("/v1/session/addWechatFansInfo", {
            //"jsCode": res.code,
            "name": data.userInfo.nickName,
            "sex": data.userInfo.gender, //性别
            "city": data.userInfo.city, //所在城市
            "province": data.userInfo.province, //所在省份
            "country": data.userInfo.country, //所在国家
            "imgUrl": data.userInfo.avatarUrl,
            "encryptedData": data.encryptedData,
            "iv": data.iv,
          }).then(data => {
            //console.log(postUserInfo);
            this.getUserStatus();
          })
        }).catch(err => {
          this.$showModal({
            title: '提示',
            content: "请允许该小程序使用用户数据，否则无法进行下一步",
            cancelText: '返回主页',
            confirmText: '继续授权',
            //success: function(res) {
            //  if (res.confirm) {
            //    wx.reLaunch({
            //      url: '../../activity/index/index',
            //    })
            //  }
            //}
          }).then(result => {
            //console.log(result);
            if (result.cancel) {
              wx.reLaunch({
                url: '../activity/index/index',
              });
            } else {
              //this.$openSetting().then(setting => {
              //  if (setting.authSetting["scope.userInfo"]) {
              //    this.postUserInfo()
              //  } else {
              //    this.postUserInfo()
              //  }
              //});
            }
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