let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      array: ['活动建议', '机构建议', 'app建议', '其它建议'],
      index: 0,
    }
  }
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }
}