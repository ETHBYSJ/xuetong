
let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      po:{
        Constellation:"",
      },
      vo:{
        message:{}
      },
      xo:{
        "birthday": "",
      },
      index: 0,
      userType: '',
    }
  }
  onShow() {
    this.setData({
      'userType': this.$app.userType
    })
    if (this.$app.userType=='教职工'){
      this.loadTechInfo()
    }else{
      this.loadInfo()
    }
    
  }
  loadInfo(){
    this.$get('/v1/family/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })
      //cooon = data.obj
      var month = (this.data.vo.message.birthday + "").split("-")[1];
      var date = (this.data.vo.message.birthday + "").split("-")[2];
      var value = '';
      if (month == "01" && date >= "20" || month == "02" && date <= "18") { value = "水瓶座"; }
      if (month == "02" && date >= "19" || month == "03" && date <= "20") { value = "双鱼座"; }
      if (month == "03" && date >= "21" || month == "04" && date <= "19") { value = "白羊座"; }
      if (month == "04" && date >= "20" || month == "05" && date <= "20") { value = "金牛座"; }
      if (month == "05" && date >= "21" || month == "06" && date <= "21") { value = "双子座"; }
      if (month == "06" && date >= "22" || month == "07" && date <= "22") { value = "巨蟹座"; }
      if (month == "07" && date >= "23" || month == "08" && date <= "22") { value = "狮子座"; }
      if (month == "08" && date >= "23" || month == "09" && date <= "22") { value = "处女座"; }
      if (month == "09" && date >= "23" || month == "10" && date <= "22") { value = "天秤座"; }
      if (month == "10" && date >= "23" || month == "11" && date <= "21") { value = "天蝎座"; }
      if (month == "11" && date >= "22" || month == "12" && date <= "21") { value = "人马座"; }
      if (month == "12" && date >= "22" || month == "01" && date <= "19") { value = "摩羯座"; }
      this.setData({
        'po.Constellation': value
      });
      }).catch(err => {
     this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }

  loadTechInfo() {
    this.$get('/v1/teacher/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })
      //cooon = data.obj
      var month = (this.data.vo.message.birthday + "").split("-")[1];
      var date = (this.data.vo.message.birthday + "").split("-")[2];
      var value = '';
      if (month == "01" && date >= "20" || month == "02" && date <= "18") { value = "水瓶座"; }
      if (month == "02" && date >= "19" || month == "03" && date <= "20") { value = "双鱼座"; }
      if (month == "03" && date >= "21" || month == "04" && date <= "19") { value = "白羊座"; }
      if (month == "04" && date >= "20" || month == "05" && date <= "20") { value = "金牛座"; }
      if (month == "05" && date >= "21" || month == "06" && date <= "21") { value = "双子座"; }
      if (month == "06" && date >= "22" || month == "07" && date <= "22") { value = "巨蟹座"; }
      if (month == "07" && date >= "23" || month == "08" && date <= "22") { value = "狮子座"; }
      if (month == "08" && date >= "23" || month == "09" && date <= "22") { value = "处女座"; }
      if (month == "09" && date >= "23" || month == "10" && date <= "22") { value = "天秤座"; }
      if (month == "10" && date >= "23" || month == "11" && date <= "21") { value = "天蝎座"; }
      if (month == "11" && date >= "22" || month == "12" && date <= "21") { value = "人马座"; }
      if (month == "12" && date >= "22" || month == "01" && date <= "19") { value = "摩羯座"; }
      this.setData({
        'po.Constellation': value
      });
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
  bindDateChange (e) {
    var month = (e.detail.value + "").split("-")[1];
    var date = (e.detail.value + "").split("-")[2];
    var value = '';
    if (month == "01" && date >= "20" || month == "02" && date <= "18") { value = "水瓶座"; }
    if (month == "02" && date >= "19" || month == "03" && date <= "20") { value = "双鱼座"; }
    if (month == "03" && date >= "21" || month == "04" && date <= "19") { value = "白羊座"; }
    if (month == "04" && date >= "20" || month == "05" && date <= "20") { value = "金牛座"; }
    if (month == "05" && date >= "21" || month == "06" && date <= "21") { value = "双子座"; }
    if (month == "06" && date >= "22" || month == "07" && date <= "22") { value = "巨蟹座"; }
    if (month == "07" && date >= "23" || month == "08" && date <= "22") { value = "狮子座"; }
    if (month == "08" && date >= "23" || month == "09" && date <= "22") { value = "处女座"; }
    if (month == "09" && date >= "23" || month == "10" && date <= "22") { value = "天秤座"; }
    if (month == "10" && date >= "23" || month == "11" && date <= "21") { value = "天蝎座"; }
    if (month == "11" && date >= "22" || month == "12" && date <= "21") { value = "人马座"; }
    if (month == "12" && date >= "22" || month == "01" && date <= "19") { value = "摩羯座"; }
    this.setData({
      'vo.message.birthday': e.detail.value,
      'po.Constellation': value,
      'xo.birthday': e.detail.value,
    })
    if (this.$app.userType == '家长') {
      this.$post('/v1/family/updateInfo', this.data.xo).then(data => {
    this.loadInfo()
    }).catch(err => {
      this.$showModal({
        title: '修改信息错误',
        content: err.msg,
        showCancel: false
      })
    })
    }else{
      this.$post('/v1/teacher/updateInfo', this.data.xo).then(data => {
        this.loadTechInfo()
      }).catch(err => {
        this.$showModal({
          title: '修改信息错误',
          content: err.msg,
          showCancel: false
        })
      })
    }
  }
  logOut(){
    var that=this;
    wx.showModal({
      title: '退出登录',
      content: '是否确定退出当前账号？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.$get('/v1/user/logout').then(data => {
            wx.removeStorageSync("__session__")
            wx.reLaunch({
              url: '/pages/funclist/funclist'
            })

          }).catch(err => {
            that.$showModal({
              title: '获取信息错误',
              content: err.msg,
              showCancel: false
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
}