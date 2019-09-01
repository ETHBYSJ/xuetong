let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      disabled: false,
      code: '获取验证码',
      po: {
        code:"",
        //code1用于存储验证code
        code1:"",
      },
      vo: {
        message: {},
        phone_display: ""
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

  //获取验证码
  bindGetYzm(e) {
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
      this.setData({
        'po.code1':data.obj,
      })
      //console.log('data: '+ JSON.stringify(data));
      //console.log('po.code1: '+ this.data.po.code1);
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

  syncCode(e) {
    this.setData({
      'po.code': e.detail.value,
    })
  }

  //第一次验证码的验证 跳转至新界面
  bindNextPhone(e){
    //console.log('po.code: ' + this.data.po.code);
    if(this.data.po.code==this.data.po.code1 && this.data.po.code!='') {
      wx.navigateTo({
        url: '/pages/member/newphone/newphone',
      })
    } else if(this.data.po.code==''){
      wx.showToast({
        title: '验证码不能为空',
        image: '/images/kulian.png',
        icon: 'loading',
        duration: 1500,  
      })
      /*wx.navigateTo({
        url: '/pages/member/newphone/newphone',
      })*/
    } else{
      wx.showToast({
        title: '验证码输错啦~',
        image: '/images/kulian.png',
        icon: 'loading',
        duration: 1500,
      })
    }
  }

  loadTechInfo() {
    this.$get('/v1/teacher/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })
      if(data.obj.phone) {
        //182****5585
        var tmp_phone = data.obj.phone;
        tmp_phone = tmp_phone.slice(0,3)+"****"+tmp_phone.slice(7);
        //console.log(tmp_phone);
        this.setData({
          'vo.phone_display': tmp_phone,
        })
      } else {
        this.setData({
          'vo.phone_display': null,
        })
      }
      //console.log(data);
      
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