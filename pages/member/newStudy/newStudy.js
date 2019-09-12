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
        basis_star: 0,
        atti_star: 0,
        habit_star: 0,
        char_star: 0,
        body_star: 0,
      },
      vo: {
        message: {},
        ten_array1: [],
        ten_array2: [],
        ten_array3: [],
        ten_array4: [],
        ten_array5: [],
      },
      userType: '',
      student_name: '',
      student_id: '',
      student_img: '',
      nowDate: '',
    }
  }

  onLoad(options) {
    this.setData({
      'student_name': options.name,
      'student_id': options.id,
      'student_img': options.img,
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
    });

    let tmp=[];
    for(let i=0; i<10; ++i) {
      tmp.push({
        'value': i+1,
        'checked': false,
      })
    }
    this.setData({
      'vo.ten_array1': tmp,
      'vo.ten_array2': tmp,
      'vo.ten_array3': tmp,
      'vo.ten_array4': tmp,
      'vo.ten_array5': tmp,
    });

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
    if(this.data.po.start_date==null || this.data.po.end_date==null) {
      wx.showModal({
        title: '提示',
        content: '请输入正确起始和终止时间',
        showCancel: false,
      })
    } else {
      /*wx.showModal({
        title: '提示',
        content: '确认提交学情反馈吗？',
        cancelText: '返回修改',
        confirmText: '确认提交',
        success(res) {
          if(res.cancel) {

          } 
          else if (res.confirm) {*/
            let args = {
              'knowledge': this.data.po.basis,
              'knowledgeRate': this.data.po.basis_star,
              'attitude': this.data.po.attitude,
              'attitudeRate': this.data.po.atti_star,
              'habits': this.data.po.habit,
              'habitsRate': this.data.po.habit_star,
              'willpower': this.data.po.character,
              'willpowerRate': this.data.po.char_star,
              'physique': this.data.po.body,
              'physiqueRate': this.data.po.body_star,
              'improve': this.data.po.progress,
              'strengths': this.data.po.strength,
              'inferiority': this.data.po.weakness,
              'startDate': this.data.po.start_date,
              'endDate': this.data.po.end_date,
              'studentId': parseInt(this.data.student_id),
            }
            this.$post('/v1/weeklyreport/update', args).then(data => {
              console.log(args);
              if (data.obj == 'SUCC') {
                wx.showModal({
                  title: '提示',
                  content: '学情反馈提交成功',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateBack({
                        delta: 1,
                      });
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '提交失败，未知错误',
                  showCancel: false,
                })
              }
            })
          //}
        //}
      //})
    }
  }

  bindBasisChange(e) {
    let tmp = this.data.vo.ten_array1;
    for(let i=0; i<e.detail.value; ++i) {
      tmp[i].checked = true;
    }
    for(let i=e.detail.value; i<10; ++i) {
      tmp[i].checked = false;
    }
    this.setData({
      'vo.ten_array1': tmp,
      'po.basis_star': e.detail.value,
    })
  }

  bindAttiChange(e) {
    let tmp = this.data.vo.ten_array2;
    for (let i = 0; i < e.detail.value; ++i) {
      tmp[i].checked = true;
    }
    for (let i = e.detail.value; i < 10; ++i) {
      tmp[i].checked = false;
    }
    this.setData({
      'vo.ten_array2': tmp,
      'po.atti_star': e.detail.value,
    })
  }

  bindHabitChange(e) {
    let tmp = this.data.vo.ten_array3;
    for (let i = 0; i < e.detail.value; ++i) {
      tmp[i].checked = true;
    }
    for (let i = e.detail.value; i < 10; ++i) {
      tmp[i].checked = false;
    }
    this.setData({
      'vo.ten_array3': tmp,
      'po.habit_star': e.detail.value,
    })
  }

  bindCharChange(e) {
    let tmp = this.data.vo.ten_array4;
    for (let i = 0; i < e.detail.value; ++i) {
      tmp[i].checked = true;
    }
    for (let i = e.detail.value; i < 10; ++i) {
      tmp[i].checked = false;
    }
    this.setData({
      'vo.ten_array4': tmp,
      'po.char_star': e.detail.value,
    })
  }

  bindBodyChange(e) {
    let tmp = this.data.vo.ten_array5;
    for (let i = 0; i < e.detail.value; ++i) {
      tmp[i].checked = true;
    }
    for (let i = e.detail.value; i < 10; ++i) {
      tmp[i].checked = false;
    }
    this.setData({
      'vo.ten_array5': tmp,
      'po.body_star': e.detail.value,
    })
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