let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      my_array: ['男', '女'],
      my_index:-1,
      vo: {
        message: {}
      },
      po: {
        "id": "",
        "name": "",
        "phone": "",
        "qq": "",
        "sex": ""
      }
    }
  }

  onLoad() {
    this.loadInfo()
    this.setData({
      'vo.imgBaseUrl': this.$app.imgBaseUrl
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
  bindPickerChange(e){
    this.setData({
        my_index: e.detail.value
    })
  }
  formMod(e){
    this.setData({
      'po.id': e.detail.value.id,
      'po.name': e.detail.value.name,
      'po.phone': e.detail.value.phone,
      'po.qq': e.detail.value.qq,
      'po.sex':  this.data.my_array[e.detail.value.sex]
    });
    console.log("11111")
  }
  confirm(){
    this.$post('/v1/student/updateInfo', this.data.po).then(data => {
       this.loadInfo()
       this.setData({
         my_index:-1
       })
     }).catch(err => {
       this.$showModal({
       title: '修改信息错误',
       content: err.msg,
       showCancel: false
       })
    })
  }


}