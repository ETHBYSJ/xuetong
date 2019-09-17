let we = require('../../../we/index.js')
let QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
let qqmap = new QQMapWX({
  key: 'FJUBZ-LMP6D-WNE4G-HM6J6-JDFNH-FCFZ2' // 必填
});
new class extends we.Page {
  data() {
    return {
      oldaddress: "",
      //地址
      searchaddress: "",
      //详细地址(选填)
      detailedaddress: "",
      //搜索返回列表
      searchlist: [],
      //是否隐藏搜索结果
      hiddenres: true,
      //是否隐藏下拉
      hiddenpull: false,
      pullstatus: 0,
      hiddenall: true,
      po: {
        address: "",
        //纬度
        latitude: "",
        //经度
        longitude: "",
      },
    }
  }
  onShow() {
    let that = this  
    this.$get('/v1/family/getInfo').then(data => {
      var tmp = data.obj.address.split('#');
      this.setData({
        'oldaddress_head': tmp[0],
        'oldaddress_tail': tmp[1],
      })
      if (data.obj.latitude != null && data.obj.longitude != null) {
        this.setData({
          'po.latitude': data.obj.latitude,
          'po.longitude': data.obj.longitude,
        })
      } else {
        this.getLocationInfo();
      }
    })  
  }

  getLocationInfo() {
    var that = this;
    wx.getLocation({
      success: function (res) {
        //console.log(res)
        that.setData({
          'po.latitude': res.latitude,
          'po.longitude': res.longitude,
        })
      },
    })
  }
  enterAddress(e) {
    //console.log(e)
    this.setData({
      searchaddress: e.detail.value,      
    })
    if(e.detail.value == "") {
      this.setData({
        hiddenall: true,
      })
    }
  }
  //详细地址
  enterDetailed(e) {
    //console.log(e)
    this.setData({
      detailedaddress: e.detail.value,
    })
  }
  //选择地址
  chooseAddress(e) {    
    this.setData({
      searchaddress: e.currentTarget.dataset.address,
      'po.latitude': e.currentTarget.dataset.lat,
      'po.longitude': e.currentTarget.dataset.lng,
      hiddenall: true,
    })

  }
  pull() {
    this.setData({
      hiddenres: this.data.pullstatus == 0 ? true : false, 
      pullstatus: 1 - this.data.pullstatus,      
    })
  }
  //保存地址
  saveAddress() {
    let that = this
    wx.showModal({
      title: '',
      content: '确定修改地址',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '正在修改...',
            icon: 'loading',
            mask: true,
            duration: 10000
          })
          that.doSaveAddress()
        }
      }
    })        
  }
  doSaveAddress() {
    this.setData({
      "po.address": this.data.searchaddress +'#'+ this.data.detailedaddress,
    })
    //console.log(this.data.po.address)
    console.log(this.data.po)
    this.$post('/v1/family/updateInfo', this.data.po).then(data => {
      //console.log(data)
      if (data.obj == 'SUCC') {
        wx.showToast({
          title: '修改成功！',
          icon: 'success',
          duration: 1000,
        })
        setTimeout(function(){
          wx.navigateBack({
            delta: 1,
          })
        }, 1000);
      } else {
        wx.showModal({
          title: '提示',
          content: '修改错误，请重试',
          showCancel: false,
        })
      }
    }).catch(err => {
      wx.showModal({
        title: '提示',
        content: '发生错误',
        showCancel: false,
      })
    })
  }
  //搜索地址
  doSearch(e) {
    let that = this
    qqmap.getSuggestion({
      keyword: that.data.searchaddress,
      page_size: 10,
      success: function (res) {
        console.log(res);
        that.setData({
          searchlist: res.data,
        })
        if(res.data.length != 0) {
          that.setData({
            hiddenpull: false,
            hiddenres: false,
            hiddenall: false,
            pullstatus: 0,
          })
        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  }
}