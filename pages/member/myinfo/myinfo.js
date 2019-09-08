let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      po:{

      },
      vo:{
        message:{},
        nowDate:"",
      },
      userType: '',
    }
  }

  
  onShow() {
    this.setData({
      'userType': this.$app.userType
    })

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    this.setData({
      'vo.nowDate': year + "-" + month + "-" + day,
    })

    if (this.$app.userType == '教职工') {
      this.loadTechInfo()
    } else {
      this.loadInfo()
    }
  }

  //修改生日
  bindBirthChange(e) {
    this.setData({
      'vo.message.birthday': e.detail.value,
    })
  }

  //修改性别
  bindSexChange(e) {
    console.log(e);
    this.setData({
      'vo.message.sex': e.detail.value,
    })
  }

  //修改手机号码
  bindPhoneChange(e) {
    wx.navigateTo({
      url: '/pages/member/modifyphone/modifyphone',
    })
  }

  //修改名字
  bindNameChange(e) {
    this.setData({
      'vo.message.name': e.detail.value,
    })
  }

  //保存修改
  toSave() {
    if(this.data.userType=='教职工') {
      this.$post('/v1/teacher/updateInfo', {
        'name': this.data.vo.message.name,
        'sex': this.data.vo.message.sex,
        'birthday': this.data.vo.message.birthday,
      }).then(data => {
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration: 1500
        })

        setTimeout(function () {
          wx.navigateBack()
        },1500);
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
    } else {
      this.$post('/v1/family/updateInfo', {
        'name': this.data.vo.message.name,
        'sex': this.data.vo.message.sex,
        'birthday': this.data.vo.message.birthday,
      }).then(data => {
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateBack()
        }, 1500);
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