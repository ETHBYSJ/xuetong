//点击已提交作业进行编辑
let we = require('../../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      //本次编辑新加的图片列表
      postList: [],
      //之前编辑加入的图片列表
      imageList: [],
      imgBaseUrl: "",
      //学生姓名
      name: "",
      //作业文字内容
      content: "",
      height: "",
      po: {
        //学生id
        studentId: "",
        imageList: [],
        //作业日期
        homeworkDate: "",
        //作业id
        id: "",
      }
    }
  }
  onLoad(options) {
    this.setData({
      "po.id": options.id,
      imgBaseUrl: this.$app.imgBaseUrl,
      name: options.name,
      "po.studentId": options.studentid,
      "po.homeworkDate": options.homeworkDate,
    })
    this.$get('/v1/homework/get?id=' + this.data.po.id).then(data => {
      this.setData({
        "po.imageList": data.obj.imageList,
      })
      let imageList = []
      for (var i = 0; i < data.obj.imageList.length; i++) {
        imageList[i] = this.data.imgBaseUrl + data.obj.imageList[i].photoPath
      }
      this.setData({
        imageList: imageList,
        content: data.obj.content,
        height: Math.ceil((this.data.imageList.length + this.data.postList.length) / 3),
      })
    })
  }
  onShow() {
    
  }
  bindInput(e) {
    this.setData({
      content: e.detail.value,
    });
  }
  deleteImg(e) {
    let delIndex = e.currentTarget.dataset.index
    this.data.imageList.splice(delIndex, 1)
    this.data.po.imageList.splice(delIndex, 1)
    this.setData({
      imageList: this.data.imageList,
      height: Math.ceil((this.data.imageList.length + this.data.postList.length) / 3),
      "po.imageList": this.data.po.imageList,
    })
    
  }
  deletePost(e) {
    let delIndex = e.currentTarget.dataset.index
    this.data.postList.splice(delIndex, 1)
    this.setData({
      postList: this.data.postList,
      height: Math.ceil((this.data.imageList.length + this.data.postList.length) / 3),
    })
  }
  fromAlbum() {
    var that = this
    wx.chooseImage({
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(res)
        that.setData({
          postList: tempFilePaths,
          height: Math.ceil((that.data.imageList.length + tempFilePaths.length) / 3),
        })
      }
    })
  }
  //点击确认
  postConfirm() {
    var that = this
    if (that.data.postList.length == 0 && !that.data.content) {
      wx.showToast({
        title: '内容不能为空',
        image: '/images/kulian.png',
        icon: 'loading',
        duration: 1500,
      })
      return
    }
    wx.showModal({
      title: '',
      content: '确定上传作业',
      confirmText: '确定',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 10000
          });
          that.executeUpload(that.data.imgBaseUrl + '/v1/homework/upload', 0, that);
        }
      }
    })
  }
  //预览图片
  imgPreview(e) {
    let that = this;
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: that.data.imageList.concat(that.data.postList),
    });
  }
  //递归上传
  executeUpload(url, index, that) {
    if (index == that.data.postList.length) {
      if (that.data.content != "") {
        //输入内容不为空
        that.setData({
          "po.content": that.data.content,
        })
      }
      console.log(that.data.po)
      that.$post('/v1/homework/update', that.data.po).then(data => {
        if (data.msg == "SUCC") {
          wx.showModal({
            title: '提示',
            content: '上传成功',
            showCancel: false,
            success(res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
        else {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false,
          })
        }
        return;
      }).catch(err => {
        this.$showModal({
          title: '出错',
          content: err.msg,
          showCancel: false
        })
      })
      return;
    }
    wx.uploadFile({
      url: that.data.imgBaseUrl + '/v1/homework/upload',
      filePath: that.data.postList[index],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'Content-Type': 'application/json'
      },
      success(res) {
        console.log(that.data.po)
        that.data.po.imageList.push({ photoPath: JSON.parse(res.data).obj })
        that.setData({
          "po.imageList": that.data.po.imageList,
        });
        that.executeUpload(url, index + 1, that)
      }
    })
  }
}