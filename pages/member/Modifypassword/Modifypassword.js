let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return{
      disabled: false,
      code: '获取验证码',
      po:{
        code: "",
        password: ""
      },
      vo:{
        message:{},
        confirm:{}
      },
      promptTxt: "",
      promptDisplay: "",
    }
  }
  onLoad() {
    if (this.$app.userType == '家长') {
      this.$get('/v1/family/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj,
      })
    }).catch(err => {
      this.$showModal({
        title: '获取电话号错误',
        content: err.msg,
        showCancel: false
      })
    })
    }else{
      this.$get('/v1/teacher/getInfo').then(data => {
        this.setData({
          'vo.message': data.obj,
        })
      }).catch(err => {
        this.$showModal({
          title: '获取电话号错误',
          content: err.msg,
          showCancel: false
        })
      })

    }
  }
  CodeData(e) {
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


    this.$get('/v1/user/fetchMsgCode?mobile=' + this.data.vo.message.phone).then(data => {
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
  voteTitle(e) {
    this.data.po.password = e.detail.value
  }
  userCode(e) {
    this.data.po.code = e.detail.value
  }
  confirm(e) {
    var myReg =/^(\w){6,20}$/;
    if (!myReg.test(this.data.po.password)){
      this.setData({
        'promptTxt': "密码格式不正确",
        'promptDisplay': "block"
      });

      setTimeout(function () {
        this.setData({ promptDisplay: "none" });
      }.bind(this), 3000)
    }else {
      this.loading();
    }
  }
  loading() {
    this.$post('/v1/user/modifyPassword', {
      "code": this.data.po.code,
      "password": this.data.po.password
    }).then(data => {
      if (data.obj == "SUCC") {
      wx.navigateBack({ url: `/pages/member/myprofile/myprofile` })
      }else{
        if (data.obj == "SMSCODE_ERROR") {
          this.$showModal({
            title: '提示',
            content: `验证码错误或已失效，请重新获取`,
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