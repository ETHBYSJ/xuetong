let we = require('../../../we/index.js')


new class extends we.Page {
  data() {
    return {
      vo: {
        'BackgroundImg': '',
        'height':'',
        'width':'',
        'olddistance':0,//上一次两个手指的距离
        'newdistance': "",//本次两手指之间的距离，两个一减咱们就知道了滑动了多少，以及放大还是缩小（正负嘛）  
        'diffdistance': '', //这个是新的比例，新的比例一定是建立在旧的比例上面的，给人一种连续的假象  
        'Scale': 1,//图片放大的比例，
        'baseHeight': '',       //原始高  
        'baseWidth': '',        //原始宽 
        'oldscaleA': 1,
        'x':'',
        'y':'',
      },
    }
  }


  onLoad() {
    var _this=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
          'vo.BackgroundImg': tempFilePaths
        })

        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {

            var str = res.width / res.height;//图片的宽高比
            if (str > 1) {//横版图片
              _this.setData({
                'vo.height': 400,//图片的显示高度为400
                'vo.baseHeight': 400,//图片的显示高度为400
              })
              _this.setData({
                 'vo.width': str * _this.data.vo.height,//图片的宽度 = 宽高比 * 图片的显示高度
                  'vo.baseWidth': str * _this.data.vo.height,//图片的宽度 = 宽高比 * 图片的显示高度
              })
            } else {//竖版图片
              var strH = res.height / res.width;//图片的宽高比
              _this.setData({
                'vo.width': 400,//图片的显示宽度为400
                'vo.baseWidth': 400,//图片的显示宽度为400
              })
              _this.setData({
                'vo.height': strH * _this.data.vo.width, //图片的高度 = 宽高比 * 图片的显示宽度
                'vo.baseHeight': strH * _this.data.vo.width, //图片的高度 = 宽高比 * 图片的显示宽度
              })
            }
          }
        })
      }

   
  })
  

    /*   var that =this;
       wx.chooseImage({
         count: 1, // 默认9
         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
         success: function (res) {
           // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
           var tempFilePaths = res.tempFilePaths;
           that.setData({
             'vo.BackgroundImg': tempFilePaths
           })
           wx.setStorageSync("__imgbg__", tempFilePaths)
           console.log(wx.getStorageSync("__imgbg__"));
          
         }
       })*/

  }

  //手指在屏幕上移动
  scroll(e) {
  var _this = this;
  //当e.touches.length等于1的时候，表示是单指触摸，我们要的是双指
  if (e.touches.length == 2) {//两个手指滑动的时候
    var xMove = e.touches[1].clientX - e.touches[0].clientX;//手指在x轴移动距离
    var yMove = e.touches[1].clientY - e.touches[0].clientY;//手指在y轴移动距离
    var distance = Math.sqrt(xMove * xMove + yMove * yMove);//根据勾股定理算出两手指之间的距离  
    if (_this.data.vo.olddistance == 0) {
      _this.setData({
        'vo.olddistance': distance,//要是第一次就给他弄上值，什么都不操作  
      })
       console.log("第一次");
    } else {
      _this.setData({
        'vo.newdistance': distance,//要是第一次就给他弄上值，什么都不操作  
      })
      
     
      _this.setData({
        'vo.diffdistance': _this.data.vo.newdistance - _this.data.vo.olddistance,//两次差值 
      })

      _this.setData({
        'vo.olddistance': _this.data.vo.newdistance,//计算之后更新比例  
      })
      
      
      _this.setData({
        'vo.Scale': _this.data.vo.oldscaleA +0.005 * _this.data.vo.diffdistance,//计算出比例来处理图片，能给用户比较好的体验
      })
      console.log(_this.data.vo.height)
      
      if (_this.data.vo.Scale > 2.5) {//放大的最大倍数
        return;
      } else if (_this.data.vo.Scale < 1) {//缩小不能小于当前
        return;
      }
      //刷新.wxml ，每次相乘，都是乘以图片的显示宽高
      _this.setData({
        'vo.height': _this.data.vo.baseHeight * _this.data.vo.Scale,
        'vo.width': _this.data.vo.baseWidth * _this.data.vo.Scale
      })
      
      _this.setData({
        'vo.oldscaleA': _this.data.vo.Scale,//更新比例  
      })


    }
  }
}
//手指离开屏幕
endTou(e) {
  this.setData({
    'vo.olddistance': 0,//重置
  })
  this.getRect();
}

  getRect() {
  var _this = this;
  wx.createSelectorQuery().select('.FilePath').boundingClientRect(function (rect) {
    _this.setData({
      'vo.x': Math.abs(rect.left),//x坐标
    })
    _this.setData({
      'vo.y': Math.abs(rect.top),//y坐标
    })
  }).exec()
}

  generate() {
  var _this = this;
  const ctx_A = wx.createCanvasContext('myCanvas_A');
  var baseWidth = _this.data.vo.baseWidth * _this.data.vo.Scale;//图片放大之后的宽
  var baseHeight = _this.data.vo.baseHeight * _this.data.vo.Scale;//图片放大之后的高
    ctx_A.drawImage(_this.data.vo.BackgroundImg[0], 0, 0, baseWidth, baseHeight);//在canvas中画一张和放大之后的图片宽高一样的图片
  ctx_A.draw();
  wx.showToast({
    title: '截取中...',
    icon: 'loading',
    duration: 10000
  });//
  setTimeout(function () {//给延时是因为canvas画图需要时间
    wx.canvasToTempFilePath({//调用方法，开始截取
      x: _this.data.vo.x,
      y: _this.data.vo.y,
      width: 400,
      height: 400,
      destWidth: 400,
      destHeight: 400,
      canvasId: 'myCanvas_A',
      success: function (res) {
        console.log(res.tempFilePath);
        wx.setStorageSync("__imgbg__", res.tempFilePath)
        wx.switchTab({
          url: '../index/index'
        })
      }
    })
  }, 2000)

}
  

}