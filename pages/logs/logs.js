//logs.js
let we = require('../../we/index.js')
const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18
new class extends we.Page {
  data() {
    return {
      clazzId: '',
      currentTab: 0,
      toView: '',
      logs: [],
      scrollTop: 0,
      HOT_NAME: 'A',
      HOT_SINGER_LEN: 0,
      listHeight: [],
      currentIndex: 0,
      fixedTitle: '',
      fixedTop: 0,
      imgBaseUrl: '',
      list: [],
      showModalStatus: false,
      list_num: "",
      winHeight: "",
      nowDate:"",
      clazzname:"",
      totalSize: '',//全部学生数量
      pageSize: '',//已到学生数量 
      pageNo: '',//未到学生数量
    }
  }
  onLoad(options) {
    /*   wx.showActionSheet({
         itemList: ['A', 'B', 'C'],
         success(res) {
           console.log(res.tapIndex)
         },
         fail(res) {
           console.log(res.errMsg)
         }
       })*/
    this.setData({
      imgBaseUrl: this.$app.imgBaseUrl
    })
    this.setData({
      clazzId: options.clazzid,
      nowDate: options.nowDate,
      clazzname: options.clazzname
    })
    this.loadlist();
    var that = this,
      list = that.data.list;
    wx.hideLoading()
    this._calculateHeight()

  }
  loadlist() {
    if (this.data.currentTab == 0) {
      var status = 2;
    } else if (this.data.currentTab == 2) {
      var status = 0;
    } else if (this.data.currentTab == 1) {
      var status = 1;
    }
    this.$get('/v1/student/listByClazzId?clazzId=' + this.data.clazzId + '&status=' + status).then(data => {
      this.setData({
        totalSize: data.totalSize,//全部学生数量
        pageSize: data.pageSize,//已到学生数量 
        pageNo: data.pageNo,//未到学生数量
        list: data.obj,
      })
      this.setData({
        logs: this._normalizeSinger(this.data.list)
      })
    }).catch(err => {
      if (err) {
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
 

  _normalizeSinger(list) {
    //歌手列表渲染
    let map = {
      hot: {
        title: "",
        items: []
      }
    }
    list.forEach((item, index) => {
      if (index < this.data.HOT_SINGER_LEN) {
        map.hot.items.push({
          name: item.name,
          avatar: item.photo,
          webchatFamilyInfoList: item.webchatFamilyInfoList,
          number: item.id,
          reach: item.reach,
        })
      }
      const key = item.index
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push({
        name: item.name,
        avatar: item.photo,
        webchatFamilyInfoList: item.webchatFamilyInfoList,
        number: item.id,
        reach: item.reach,
      })
    })
    // 为了得到有序列表，我们需要处理 map
    let ret = []
    let hot = []
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === this.data.HOT_NAME) {
        hot.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  }
  _scroll(e) {
    var newY = e.detail.scrollTop;
    this.scrollY(newY);
  }
  scrollY(newY) {
    const listHeight = this.data.listHeight
    // 当滚动到顶部，newY>0
    if (newY == 0 || newY < 0) {
      this.setData({
        currentIndex: 0,
        fixedTitle: ''
      })
      return
    }
    // 在中间部分滚动
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (newY >= height1 && newY < height2) {
        console.log(i)
        this.setData({
          currentIndex: i,
          //  fixedTitle: this.data.logs[i].title
        })
        this.fixedTt(height2 - newY);
        return
      }
    }
    // 当滚动到底部，且-newY大于最后一个元素的上限
    this.setData({
      currentIndex: listHeight.length - 2,
      // fixedTitle: this.data.logs[listHeight.length - 2].title
    })
  }
  fixedTt(newVal) {
    let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
    if (this.data.fixedTop === fixedTop) {
      return
    }
    this.setData({
      fixedTop: fixedTop
    })
  }
  _calculateHeight() {
    var lHeight = [],
      that = this;
    let height = 0;
    lHeight.push(height);
    var query = wx.createSelectorQuery();
    setTimeout(function() {
      query.selectAll('.list-group').boundingClientRect(function(rects) {
        var rect = rects,
          len = rect.length;
        for (let i = 0; i < len; i++) {
          height += rect[i].height;
          lHeight.push(height)
        }
      }).exec();
    }, 1000)
    var calHeight = setInterval(function() {
      if (lHeight.length != 1) {
        that.setData({
          listHeight: lHeight
        });
        clearInterval(calHeight);
      }
    }, 1000)
  }
  scrollToview(e) {
    var id = e.target.dataset.id
    if (id == '热') {
      this.setData({
        scrollTop: 0
      })
    } else {
      this.setData({
        toView: id
      })
    }
  }

  powerDrawer(e) {
    console.log(e.currentTarget.dataset.index)
    this.setData({
      list_num: e.currentTarget.dataset.index
    })
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  }
  util(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function() {
      // 执行第二组动画：Y轴不偏移，停
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭抽屉
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)

    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  }
  calling(e) {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  }

  changeReach(e) {
    var name = e.currentTarget.dataset.name;
    var studentId = e.currentTarget.dataset.studentid;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否将学生  ' + name + '  改签为已到 ？',
      success(res) {
        if (res.confirm) {
          that.$get('/v1/attendance/changeReachStatusByStudentId?studentId=' + studentId).then(data => {
            that.$showModal({
              title: '提示',
              content: '已将学生 ' + name + ' 改签为已到 !',
              showCancel: false
            })
            that.loadlist();
          }).catch(err => {
            if (err) {
              that.$showModal({
                title: '提示',
                content: `${err.message}`,
                showCancel: false
              })
            } else {
              that.$showModal({
                title: '提示',
                content: err.msg,
                showCancel: false
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }
  // 滚动切换标签样式
  switchTab(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.loadlist();
  }
  //导航事件处理函数
  swichNav(e) {
    var current = e.currentTarget.dataset.current;
    this.setData({
      currentTab: current,
    });
  }

  addImg(){

    wx.chooseImage({
      count: 1,//选择数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const src = res.tempFilePaths[0]
        wx.redirectTo({
          url: `../addImage/addImage?src=${src}`,
        })
      },
    })
  }

}