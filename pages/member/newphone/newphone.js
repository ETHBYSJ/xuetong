let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      disabled: false,
      code: '获取验证码',
      po: {
        code: "",
        code1: "",
        phone: "",
        name: "",
      },
      vo: {
        message: {},
        phone_display: "",
        new_phone: ""
      },
      args: {
        code:"",
        //email:"",
        mobile:"",
        //name:"",
        type: "",
      },
      userType: '',
    }
  }

  changeSex(e) {
    console.log(e);
    this.setData({
      'vo.message.sex': e.detail.value,
    })
  }

  onShow() {
    this.setData({
      'userType': this.$app.userType
    })

    if (this.$app.userType == '教职工') {
      this.loadTechInfo()
    } else {
      this.loadInfo()
    }
  }

  //检查手机号合法性
  checkPhone(){
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.po.phone.length == 0) {
      wx.showToast({
        title: '输入手机号为空',
        image: '/images/kulian.png',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else if (this.data.po.phone.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        image: '/images/kulian.png',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(this.data.po.phone)) {
      wx.showToast({
        title: '手机号格式有误！',
        image: '/images/kulian.png',
        icon: 'success',
        duration: 1500
      })
      return false;
    } else {
      wx.showToast({
        title: '验证码发送成功！',
        icon: 'success',
        duration: 1500
      })
      return true;
    } 
  }

  //获取验证码
  bindGetYzm(e) {
    if(this.checkPhone(this.data.po.phone)){
      var that = this;
      var time = 60;
      that.setData({
        code: '60秒后重发',
        disabled: true
      })
      var Interval = setInterval(function () {
        time--;
        if (time > 0) {
          that.setData({
            code: time + '秒后重发'
          })
        } else {
          clearInterval(Interval);
          that.setData({
            code: '获取验证码',
            disabled: false
          })
        }
      }, 1000)

      this.$get('/v1/user/fetchMsgCode?mobile=' + this.data.po.phone).then(data => {
        /*
          this.$showModal({
            title: '提示',
            content: data.msg + " " + data.obj,
            showCancel: false
          })
        */
        //console.log(this.data.po.phone);
        //发送验证码后固定手机号码，防止手机号改
        console.log(data.obj);

        this.setData({
          'vo.new_phone': this.data.po.phone,
          'po.code1': data.obj,
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
  }

  syncCode(e) {
    this.setData({
      'po.code': e.detail.value,
    })
  }

  syncPhone(e) {
    this.setData({
      'po.phone': e.detail.value,
    })
  }

  //验证
  bindNewPhone(e) {
    if(this.data.vo.new_phone!=this.data.po.phone) {
      wx.showModal({
        title: '提示',
        content: '检测到您输入的手机号码与接收验证码的手机号码不同，请输入刚刚接受验证码的手机号码，或选择返回至个人资料重新设置。',
        confirmText: '重新输入',
        cancelText:'返回个人资料',
        success: function (res) {
          if (res.confirm) {
          
          } else {
            this.setData({
              'po.code1': "",
              'vo.new_phone': "",
            })
            wx.navigateBack({
              delta: 2
            })
          }
        }
      })
    } else if(this.data.po.code=='') {
      wx.showToast({
        title: '请输入验证码',
        image: '/images/kulian.png',
        icon: 'success',
        duration: 1500,
      })
    } else {
      this.setData({
        'args.code': this.data.po.code, 
        'args.mobile': this.data.vo.new_phone,
        'args.type': (this.data.userType=='家长' ? 1:2),
      })

      this.$post('/v1/user/modifyMobile', {
        'code': this.data.args.code,
        'mobile': this.data.args.mobile,
        'type': this.data.args.type,
      }).then(data => {
        console.log(this.data.args);
        if (data.obj == "SUCC") {
          this.$showToast({
            title: '绑定成功！',
            icon: 'success',
            duration: 2000,
            mask: true
          })

          setTimeout(function () {
            wx.navigateBack({
              delta: 2,
            })
          }, 1000)
        } else {
          if (data.obj == "SMSCODE_ERROR") {
            this.$showModal({
              title: '提示',
              content: `验证码错误或已失效，请重新获取`,
              showCancel: false
            })
          } else if (data.obj == "PASSWORD_ERROR") {
            //console.log(data.obj);
            this.$showModal({
              title: '提示',
              content: `密码错误，登录失败`,
              showCancel: false
            })
          } else if (data.obj == "ERROR") {
            //console.log(data.obj);
            this.$showModal({
              title: '提示',
              content: `请求失败，请重试`,
              showCancel: false
            })
          } else if (data.obj == "WORD_BLANK") {
            //console.log(data.obj);
            this.$showModal({
              title: '提示',
              content: `请求参数为空，请求失败`,
              showCancel: false
            })
          } else if (data.obj == "MOBILE_EXIST") {
            //console.log(data.obj);
            this.$showModal({
              title: '提示',
              content: `手机号已被其他账户绑定，请更换`,
              showCancel: false
            })
          } else if (data.obj == "USER_INFO_FAIL") {
            //console.log(data.obj);
            this.$showModal({
              title: '提示',
              content: `用户信息错误`,
              showCancel: false
            })
          } else if (data.obj == "USER_CHANGE_FAIL") {
            //console.log(data.obj);
            this.$showModal({
              title: '提示',
              content: `用户信息修改失败`,
              showCancel: false
            })
          }
        }
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
    
    
  }

  loadTechInfo() {
    this.$get('/v1/teacher/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })
      if (data.obj.phone) {
        var tmp_phone = data.obj.phone;
        tmp_phone = tmp_phone.slice(0, 3) + "****" + tmp_phone.slice(7);
        console.log(tmp_phone);
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