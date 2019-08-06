let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      disabled: false,
      code: '获取验证码',
      po: {
        "email": "",
      },
      vo: {
        message:{}
      },
      promptTxt: "",
      promptDisplay: "",
    }
  }
  onLoad() {
    if(this.$app.userType == '家长'){
      this.$get('/v1/family/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj,
      })
    }).catch(err => {
      this.$showModal({
        title: '获取邮箱错误',
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
          title: '获取邮箱错误',
          content: err.msg,
          showCancel: false
        })
    })
  }
  }
  syncName(e) {
    this.setData({
      'po.email': e.detail.value,
    })
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
  toSave() {
    var myReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!myReg.test(this.data.po.email)) {
      this.setData({
        'promptTxt': "邮箱格式输入错误",
        'promptDisplay': "block"
      });

      setTimeout(function () {
        this.setData({ promptDisplay: "none" });
      }.bind(this), 3000)
    } else {
      if (this.$app.userType == '家长') {
        this.loading()
      } else {
        this.toTeachSave()
      }
    }

  }
  loading() {
    this.$post('/v1/family/updateInfo', this.data.po).then(data => {
      this.$navigateBack()
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
  toTeachSave() {
    this.$post('/v1/teacher/updateInfo', this.data.po).then(data => {
      this.$navigateBack()
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