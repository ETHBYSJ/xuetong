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
      rates1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      rates2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      rates3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      rates4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      rates5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
  }

  onLoad(options) {
    this.setData({
      'feedback_id': options.id,
      'student_id' : options.studentid,
      'student_name': options.name,
      'student_img': options.img
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
      let tmp = data.obj;
      let rates1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let rates2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let rates3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let rates4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let rates5 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (tmp.knowledge == null || tmp.knowledge == undefined) {
        tmp.knowledge = '';
      }
      if (tmp.attitude == null || tmp.attitude == undefined) {
        tmp.attitude = '';
      }
      if (tmp.habits == null || tmp.habits == undefined) {
        tmp.habits = '';
      }
      if (tmp.willpower == null || tmp.willpower == undefined) {
        tmp.willpower = '';
      }
      if (tmp.physique == null || tmp.physique == undefined) {
        tmp.physique = '';
      }
      if (tmp.improve == null || tmp.improve == undefined) {
        tmp.improve = '';
      }
      if(tmp.strengths == null || tmp.strengths == undefined) {
        tmp.strengths = '';
      }
      if (tmp.inferiority == null || tmp.inferiority == undefined) {
        tmp.inferiority = '';
      }
      if (tmp.knowledgeRate == null || tmp.knowledgeRate == undefined) {
        tmp.knowledgeRate = 0;
      }
      if (tmp.attitudeRate == null || tmp.attitudeRate == undefined){
        tmp.attitudeRate = 0;
      }
      if (tmp.habitsRate == null || tmp.habitsRate == undefined) {
        tmp.habitsRate = 0;
      }
      if (tmp.willpowerRate == null || tmp.willpowerRate == undefined) {
        tmp.willpowerRate = 0;
      }
      if (tmp.physiqueRate == null || tmp.physiqueRate == undefined) {
        tmp.physiqueRate = 0;
      }

      for (let i = 0; i < tmp.knowledgeRate; ++i) {
        rates1[i] = 1;
      }
      for (let i = 0; i < tmp.attitudeRate; ++i) {
        rates2[i] = 1;
      }
      for (let i = 0; i < tmp.habitsRate; ++i) {
        rates3[i] = 1;
      }
      for (let i = 0; i < tmp.willpowerRate; ++i) {
        rates4[i] = 1;
      }
      for (let i = 0; i < tmp.physiqueRate; ++i) {
        rates5[i] = 1;
      }

      this.setData({
        'vo.feedback': tmp,
        'rates1': rates1,
        'rates2': rates2,
        'rates3': rates3,
        'rates4': rates4,
        'rates5': rates5,
      })   
      console.log(tmp);
      console.log(this.data.rates5);
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
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
}