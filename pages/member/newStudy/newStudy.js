let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      disabled: false,
      code: '获取验证码',
      po: {
        basis: '',
        attitude: '',
        habit: '',
        character: '',
        body: '',
        progress: '',
        strength: '',
        weakness: '',
        start_date: null,
        end_date: null,
      },
      vo: {
        message: {},
      },
      userType: '',
      student_name: '',
      student_id: '',
      nowDate: '',
    }
  }

  onLoad(options) {
    this.setData({
      'student_name': options.name,
      'student_id': options.id,
    });
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
      'nowDate': year + "-" + month + "-" + day,
    })

    if (this.$app.userType == '教职工') {
      this.loadTechInfo()
    } else {
      this.loadInfo()
    }
  }

  syncBasis(e) {
    this.setData({
      'po.basis': e.detail.value,
    })
  }

  syncAttitude(e) {
    this.setData({
      'po.attitude': e.detail.value,
    })
  }

  syncHabit(e) {
    this.setData({
      'po.habit': e.detail.value,
    })
  }

  syncCharacter(e) {
    this.setData({
      'po.character': e.detail.value,
    })
  }

  syncBody(e) {
    this.setData({
      'po.body': e.detail.value,
    })
  }

  syncProgress(e) {
    this.setData({
      'po.progress': e.detail.value,
    })
  }

  syncStrength(e) {
    this.setData({
      'po.strength': e.detail.value,
    })
  }

  syncWeakness(e) {
    this.setData({
      'po.weakness': e.detail.value,
    })
  }
  
  toSave() {

  }



  bindStartDateChange(e) {
    this.setData({
      'po.start_date': e.detail.value,
    })
  }

  bindEndDateChange(e) {
    this.setData({
      'po.end_date': e.detail.value,
    })
  }


  
  //创建新的学情反馈
  bindNewStudy() {
    wx.navigateTo({
      url: '/pages/member/createStudy/createStudy',
    })
  }

  loadTechInfo() {
    this.$get('/v1/teacher/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })
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