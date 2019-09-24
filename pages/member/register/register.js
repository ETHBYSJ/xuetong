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
      selectIndex: 1,
      promptTxt:"",
      promptDisplay: "",
    }
  }

  onLoad() {
   
    
  }

  //短信登陆
  formSMS(e) {
    this.setData({
      'po.mobile': e.detail.value.mobile,
      'po.code': e.detail.value.code,
      'po.password': ""
    });
  }

  formpassword(e) {
    this.setData({
      'po.mobile': e.detail.value.mobile,
      'po.password': e.detail.value.password,
      'po.code': ""
    });
  }
 
  Landcode(){
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(this.data.po.mobile)){
      this.setData({
        'promptTxt': "手机号输入错误",
        'promptDisplay': "block"
      });
     
      setTimeout(function(){
        this.setData({ promptDisplay: "none" });
      }.bind(this),3000)

    }else{
      if (this.data.po.type == "" && this.data.items.length>1) {
        this.setData({
          'promptTxt': "请选择登录类型",
          'promptDisplay': "block"
        });

        setTimeout(function () {
          this.setData({ promptDisplay: "none" });
        }.bind(this), 3000)
      }else if (this.data.po.code==""){
        this.setData({
          'promptTxt': "验证码不能为空",
          'promptDisplay': "block"
        });

        setTimeout(function () {
          this.setData({ promptDisplay: "none" });
        }.bind(this), 3000)
      }else{
        this.Landing() 
      }
    }
  }

  Landpassword() {
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
      if (this.data.po.type == "" && this.data.items.length > 1){
        this.setData({
          'promptTxt': "请选择登录类型",
          'promptDisplay': "block"
        });

        setTimeout(function () {
          this.setData({ promptDisplay: "none" });
        }.bind(this), 3000)
     } else if (this.data.po.password == "") {
       this.setData({
         'promptTxt': "密码不能为空",
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
    this.$post('/v1/user/add', {
      "code": this.data.po.code,
      "mobile": this.data.po.mobile,
      "password": this.data.po.password,
      "type": this.data.po.type,
    }).then(data => {

     // console.log(this.data.po);

      if (data.obj == "SUCC"){
        this.getUserStatus()
      }else{
        if (data.obj == "SMSCODE_ERROR"){
          this.setData({
            'po.code': '',
          });
          this.$showModal({
            title: '提示',
            content: `验证码错误或已失效，请重新获取`,
            showCancel: false
          })
        }else{
          this.setData({
            'po.password': '',
          });
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

  /*获取用户状态信息*/
  getUserStatus() {
    var that = this
    wx.login({
      success: function (res) {
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
    var that=this;
    this.$get('/v1/session/fetchLoginStatus/' + jsCode).then(data => {
      that.$app.userdtatus = data.obj;
      /*
      wx.switchTab({
        url: '/pages/activity/index/index',
      })
      */
      wx.switchTab({
        url: '/pages/member/MemberCenter/MemberCenter',
      })
    }).catch(err => {
      this.$showModal({
        title: '获取粉丝状态错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
  bindEquipmentId(e){
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    this.setData({
      'po.mobile': e.detail.value,
    });
    if (myreg.test(this.data.po.mobile)){
      this.$get('/v1/user/getUserTypeByMobile?mobile=' + this.data.po.mobile).then(data => {
        //console.log(data);
        if(data.obj.length == 1){
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
  bindCodeId(e){
    this.setData({
      'po.code': e.detail.value,
    });

  }
  bindPasswordId(e){
    this.setData({
      'po.password': e.detail.value,
    });

  }
  radioChanges(e){
    this.setData({
      'po.type': e.detail.value,
    });
  }

  CodeData() {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(this.data.po.mobile)) {
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

  radioChange (e) {
    var checked = this.data.checked;
    if (checked == true) {
      checked = false
    } else {
      checked = true
    }
    this.setData({
      checked: checked
    })
  }

  switchSlider(e) {
    this.setData({
      'selectIndex': e.target.dataset.index
    })
  }
  Returnindex(e) {
    wx.switchTab({
      url: '/pages/activity/index/index'
    })
  }

  
 

}
