let we = require('../../../we/index.js')


new class extends we.Page {
  data() {
    return {
      po: {
        'attachList': [],
        'attachVideoList': [],
      },
      vo: {
        'dest': [],
        'photoList': [],
        'clazzList': [],
        'imgBaseUrl': "",

      },
      clazzid: '',
      page: 1,
      size: 18,
      total: "",
      userType: '',
      status: false,
    }
  }

  onLoad(options) {
    this.setData({
      'vo.imgBaseUrl': this.$app.imgBaseUrl,
      'gradename': options.gradename,
      'clazzname': options.clazzname,
      'clazzid': options.clazzid,
      'userType': this.$app.userType
    })
    this.clazzList(options.clazzid)
  }

  //获取班级相册列表
  clazzList(id) {
    this.$get(
      '/v1/photoalbum/getPhotoAlbumList?type=rtClazz&id=' + id + '&page=' + this.data.page + '&size=' + this.data.size).then(data => {
      this.setData({
        'vo.clazzList': this.data.vo.clazzList.concat(data.obj),
        total: data.totalSize,
      })
      var map = {},
        dest = [],
        imgpath = '';
      for (var i = 0; i < this.data.vo.clazzList.length; i++) {
        var index=i;
        if (this.data.vo.clazzList[i].duration){
          this.setData({
            [`vo.clazzList[${index}].duration`]: this.sec_to_time(this.data.vo.clazzList[i].duration)
          })
         
        }
        
        var ai = this.data.vo.clazzList[i];
        if (ai.filetype == 0) {
          imgpath = this.data.vo.imgBaseUrl + ai.photoPath;
        }
        if (!map[ai.uploadDate]) {
          dest.push({
            uploadDate: ai.uploadDate,
            data: [ai],
            imgList: imgpath ? [imgpath] : [],
          });
          map[ai.uploadDate] = ai;

        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.uploadDate == ai.uploadDate) {
              dj.data.push(ai);
              if (ai.filetype == 0) {
                dj.imgList.push(this.data.vo.imgBaseUrl + ai.photoPath);
              }
              break;
            }
          }
        }
      }
      this.setData({
        'vo.dest': dest,
      })
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
  /*上拉加载更多*/
  onReachBottom() {
    if ((this.data.page * this.data.size) < this.data.total) {
      this.setData({
        page: this.data.page + 1
      })
      this.clazzList(this.data.clazzid)
    }
  }

  //浏览图片
  imgYu(e) {
    let src = e.currentTarget.dataset.src;
    let imgList = e.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  }
  
  // 删除图片
  deleteImg(e) {
    var that = this;
    var imgs = that.data.imgs;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    var type = e.currentTarget.dataset.type;
    wx.showModal({
      title: '提示',
      content: type == 0 ? '确定要删除此图片吗？' : '确定要删除视频吗？',
      success: function(res) {
        if (res.confirm) {
          that.$get(
            '/v1/photoalbum/delete?id=' + index).then(data => {
            that.setData({
              'vo.clazzList': [],
              'vo.dest': [],
              page: 1,
            })
            that.clazzList(that.data.clazzid)
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

        } else if (res.cancel) {
          return false;
        }
      }
    })
  }
  //上传图片
  uploadPhoto() {
    var that = this;
    wx.chooseImage({
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          'po.attachList': tempFilePaths
        })
        that.complaint()
      }
    })
  }
  complaint() {
    var that = this;
    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    var uploadImgCount = 0;
    for (var i = 0; i < that.data.po.attachList.length; i++) {
      wx.uploadFile({
        url: that.$app.imgBaseUrl + '/v1/photoalbum/upload',
        filePath: that.data.po.attachList[i],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          'Content-Type': 'application/json'
        },
        formData: {
          'type': 'rtClazz',
          'id': that.data.clazzid,
          'filetype': 0,
        },
        success(res) {
          uploadImgCount++;
          if (uploadImgCount == that.data.po.attachList.length) {
            that.setData({
              'po.attachList': [],
              'vo.clazzList': [],
              'vo.dest': [],
              page: 1,
              status: false,
            })
            wx.hideToast();
            that.clazzList(that.data.clazzid)
          }
        }
      })
    }


  }

  chooseVideo() {
    var that = this
    wx.chooseVideo({
      success: function(res) {
        that.setData({
          'po.attachVideoList': res.tempFilePath,
        })
        that.complaintVideo();
      }
    })
  }

  complaintVideo() {
    var that = this;
    wx.showToast({
      title: '正在上传...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    wx.uploadFile({
      url: that.$app.imgBaseUrl + '/v1/photoalbum/upload',
      filePath: that.data.po.attachVideoList,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'Content-Type': 'application/json'
      },
      formData: {
        'type': 'rtClazz',
        'id': that.data.clazzid,
        'filetype': 1,
      },
      success(res) {
        that.setData({
          'po.attachVideoList': [],
          'vo.clazzList': [],
          'vo.dest': [],
            page: 1,
            status: false,
        })
        wx.hideToast();
        that.clazzList(that.data.clazzid)
      }
    })

  }
  //预览视频
  videoYu(e) {
    let VideoContext = wx.createVideoContext('' + e.currentTarget.dataset.index);
    VideoContext.requestFullScreen()

  }

  bindVideoScreenChange(e) {
    let status = e.detail.fullScreen;
    console.log(status)
    let VideoContext = wx.createVideoContext('' + e.currentTarget.dataset.index);
    if (status) {
      this.setData({
        status: true,
      })
      VideoContext.play()
    } else {
      this.setData({
        status: false,
      })
      VideoContext.pause()
    }
  }


  sec_to_time(s) {
    if (!isNaN(s)){
    var t;
    if (s > -1) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;

      if (min < 10) {
        t = "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
  } else {
  return s;
  }

  }
}