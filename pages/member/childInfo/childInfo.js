let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {  
      vo: {
        imgBaseUrl: "",
        id: "",
        name: "",
        photo: "",
        birthday: "",
        sex: "",
        clazz: {},
      },
      po: {
        id: "",
        /*
        id: "",
        name: "",
        sex: "",
        birthday: "",
        */
      }
    }
  }
  onLoad(options) {
    this.setData({
      "vo.id": options.id,
      "vo.imgBaseUrl": this.$app.imgBaseUrl,
      "po.id": options.id,
    })
  }
  onShow() {
    this.$get('/v1/student/getInfo?id=' + this.data.vo.id).then(data => {
      console.log(data)
      this.setData({
        "vo.name": data.obj.name,
        "vo.photo": data.obj.photo,
        "vo.sex": data.obj.sex,
        "vo.birthday": data.obj.birthday,
        "vo.clazz": data.obj.clazz,
      })
      console.log(this.data)
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
  //修改名字
  bindNameChange(e) {
    console.log(e)
    this.setData({
      'po.name': e.detail.value,
      'vo.name': e.detail.value,
    })
  }
  //修改性别
  bindSexChange(e) {
    console.log(e);
    this.setData({
      'po.sex': e.detail.value,
      'vo.sex': e.detail.value,
    })
  }
  //修改生日
  bindBirthChange(e) {
    this.setData({
      'po.birthday': e.detail.value,
      'vo.birthday': e.detail.value,
    })
  }
  //保存修改
  saveInfo() {
    let that = this
    console.log(this.data.po)
    wx.showModal({
      title: '',
      content: '确定修改信息',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '正在提交...',
            icon: 'loading',
            mask: true,
            duration: 10000
          })
          that.$post('/v1/student/updateInfo', that.data.po).then(data => {
            console.log(data)
            wx.navigateBack({
              delta: 1
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
    })

  }
}