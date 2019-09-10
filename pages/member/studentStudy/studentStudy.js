let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      disabled: false,
      code: '获取验证码',
      po: {
        
      },
      vo: {
        message: {},
        feedback: {}
      },
      userType: '',
      feedback_id: '',
      student_name: '',
      student_id: null,
    }
  }

  onLoad(options) {
    this.setData({
      'feedback_id': options.id,
      'student_id' : options.studentid,
      'student_name': options.name,
    });
  }

  onShow() {
    this.loadFeedInfo();

    this.setData({
      'userType': this.$app.userType
    })

    if (this.$app.userType == '教职工') {
      this.loadTechInfo()
    } else {
      this.loadInfo()
    }
  }

  //创建新的学情反馈
  bindNewStudy() {
    wx.navigateTo({
      url: '/pages/member/createStudy/createStudy',
    })
  }

  loadFeedInfo() {
    this.$get('/v1/weeklyreport/get?id='+this.data.feedback_id).then(data => {
      this.setData({
        'vo.feedback': data.obj,
      })   
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