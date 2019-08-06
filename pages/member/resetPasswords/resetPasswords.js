let we = require('../../../we/index.js')


new class extends we.Page {
  data() {
    return {
      disabled: false,
      code: '获取验证码',
      po: {
        "code": "",
        "mobile": "",
        "password": "",
        "type":"",
      },
      vo: {

      },
      items: [],
      checked: true,
      selectIndex: 0,
      promptTxt: "",
      promptDisplay: "",
    }
  }

  onLoad() {

  }

  //修改密码
  formSMS(e) {
    this.setData({
      'po.mobile': e.detail.value.mobile,
      'po.code': e.detail.value.code,
      'po.password': e.detail.value.password
    });
  }
  Landcode() {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(this.data.po.mobile)) {
      this.setData({
        'promptTxt': "手机号输入错误",
        'promptDisplay': "block"
      });

      setTimeout(function () {
        this.setData({ promptDisplay: "none" });
      }.bind(this), 3000)

    } else {
      if (this.data.po.type == "") {
        this.setData({
          'promptTxt': "请选择登录类型",
          'promptDisplay': "block"
        });

        setTimeout(function () {
          this.setData({ promptDisplay: "none" });
        }.bind(this), 3000)
      } else if (this.data.po.code == "") {
        this.setData({
          'promptTxt': "验证码不能为空",
          'promptDisplay': "block"
        });

        setTimeout(function () {
          this.setData({ promptDisplay: "none" });
        }.bind(this), 3000)
      } else {
        this.Landing()
      }
    }
  }

  Landing() {
    this.$post('/v1/user/resetPassword', {
      "code": this.data.po.code,
     "mobile": this.data.po.mobile,
      "password": this.data.po.password,
      "type": this.data.po.type,
    }).then(data => {
      wx.reLaunch({
        url: `/pages/member/register/register?type=1` 
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
  bindEquipmentId(e) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    this.setData({
      'po.mobile': e.detail.value,
    });
    if (myreg.test(this.data.po.mobile)) {
      this.$get('/v1/user/getUserTypeByMobile?mobile=' + this.data.po.mobile).then(data => {
        console.log(data);
        if (data.obj.length == 1) {
          this.setData({
            "po.type": data.obj[0].type,
          });
        }
        this.setData({
          items: data.obj,
        });
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
  bindPasswordsId(e) {
    this.setData({
      'po.password': e.detail.value,
    });
  }
  bindCodeId(e) {
    this.setData({
      'po.code': e.detail.value,
    });

  }
  radioChanges(e) {
    this.setData({
      'po.type': e.detail.value,
    });
  }
  CodeData() {
    console.log(this.data.po.mobile);
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(this.data.po.mobile)) {
      this.setData({
        'promptTxt': "手机号输入错误",
        'promptDisplay': "block"
      });

      setTimeout(function () {
        this.setData({ promptDisplay: "none" });
      }.bind(this), 3000)

    } else {
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
      this.$get('/v1/user/fetchMsgCode?mobile=' + this.data.po.mobile).then(data => {
        /* this.$showModal({
           title: '提示',
           content: data.msg+" "+data.obj,
           showCancel: false
         })*/
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
  Returnindex(e) {
    wx.switchTab({
      url: '/pages/movie/index/index'
    })
  }
}
