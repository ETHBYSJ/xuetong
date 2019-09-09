let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {   
      imgBaseUrl: "",   
      childrenList: [],     
      po: {
        "name": "",
        "sex": "",
        "birthday": "",
      }
    }
  }

  onLoad() {
    this.loadInfo()
    this.setData({
      imgBaseUrl: this.$app.imgBaseUrl
    })
  }
  loadInfo() {
    this.$get('/v1/family/getInfo').then(data => {
      console.log(data.obj)
      this.setData({
        childrenList: data.obj.studentList,
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
  
  childInfo(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/member/childInfo/childInfo?id=' + e.currentTarget.dataset.id,
    })
  }
  /*
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
  */

}