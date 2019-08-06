let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      noticeid:"",
      hidden:true,
      userdtatus:"",
      po: {
      },
      vo: {
        UserInfo: {},
        unreadCount:0,
      }
    }
  }

  onLoad(options) {
   
    console.log(options)
    if (options.noticeid){
      this.setData({
        noticeid: options.noticeid
      })
    }
    
   
  }

  onShow() {
   
    this.setData({
      'vo.imgBaseUrl': this.$app.imgBaseUrl,
      userdtatus: this.$app.userdtatus,
    })
    if (this.data.userdtatus == 103) { 
     
      this.setData({
        hidden: false,
      })
    }
    this.getUserStatusByLogin();
  }
  


  /*获取用户未读信息*/
  getUserNoticeCount(){
    this.$get('/v1/notice/getUserNoticeCount').then(data => {
      this.setData({
        'vo.unreadCount': data.obj.unreadCount
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
  getUserStatusByLogin() {
    console.log(this.data.userdtatus)
    if(this.data.userdtatus !=103){
      wx.reLaunch({ url: `/pages/member/register/register` })

    }else{
      this.getUserNoticeCount();
        this.setData({
            hidden: false,
          })
        if (this.data.noticeid){
            wx.navigateTo({
              url: '/pages/answer/answer?noticeid=' + this.data.noticeid
            })
            this.data.noticeid=null
          }else{
            this.UserInfo()
          }
    }
}

  UserInfo() {
   this.$get('/v1/member').then(data => {
      this.setData({
        'vo.UserInfo': data.obj,
      })
     this.$app.userType = data.obj.userType;
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