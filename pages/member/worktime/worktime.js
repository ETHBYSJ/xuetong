let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      po: {
        "worktime": "",
      },
      vo: {
      },
      userType: '',
    }
  }
  onShow() {
    this.setData({
      'userType': this.$app.userType
    })
  }

  syncName(e) {
    this.setData({
      'po.worktime': e.detail.value
    })
  }
  toSave() {
    this.$post('/v1/grade/updateInfo', this.data.po).then(data => {
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