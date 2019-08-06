let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      po: {
        "address": "",
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
      'po.address': e.detail.value
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