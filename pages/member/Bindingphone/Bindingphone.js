let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      disabled: false,
      code: '获取验证码',
      po: {
        "mobile": "",
        "code":"",
        "password": ""
      },
      vo: {
      },
      promptTxt: "",
      promptDisplay: "",
    }
  }
  syncName(e) {
    this.setData({
      'po.mobile': e.detail.value,
    })
  }
  syncPass(e) {
    this.setData({
      'po.password': e.detail.value,
    })
  }
  bindEquipmentId(e) {
    this.setData({
      'po.code': e.detail.value,
    });
  }
  CodeData(e) {
    var myReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var pass = /^\d{6}$/;
    if (!myReg.test(this.data.po.mobile)) {
      this.setData({
        'promptTxt': "手机号输入错误",
        'promptDisplay': "block"
      });
      setTimeout(function () {
        this.setData({ promptDisplay: "none" });
      }.bind(this), 3000)
    }else{
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
        /*
          this.$showModal({
            title: '提示',
            content: data.msg + " " + data.obj,
            showCancel: false
          })
          */
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
  toSave() {
    var myReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    var pass = /^\d{6}$/;
    if (!myReg.test(this.data.po.mobile)){
      this.setData({
        'promptTxt': "手机号输入错误",
        'promptDisplay': "block"
      });

      setTimeout(function () {
        this.setData({ promptDisplay: "none" });
      }.bind(this), 3000)

    } else{
        this.loading()
    }
    
  }
  loading() {
    this.$post('/v1/user/modifyMobile', this.data.po).then(data => {
      if (data.obj == "SUCC") {
        this.$navigateBack()
      } else {
        if (data.obj == "SMSCODE_ERROR") {
          this.$showModal({
            title: '提示',
            content: `验证码错误或已失效，请重新获取`,
            showCancel: false
          })
        } else {
          this.$showModal({
            title: '提示',
            content: `密码错误，登录失败`,
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