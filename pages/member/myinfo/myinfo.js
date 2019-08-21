let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      po:{

      },
      vo:{
        message:{}
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