let we = require('../../../../we/index.js')
new class extends we.Page {
  data() {
    return {      
      name: "",
      imgBaseUrl: "",
      nowday: "",
      postList: [],
      height: 0,     
      content: "",
      po: {
        imageList: [],
        studentId: "",
        homeworkDate: "",
        //deleteTag: 1,
      },
    }
  }
  onLoad(options) {
    this.setData({
      "po.studentId": options.studentid,
      name: options.name,
      imgBaseUrl: this.$app.imgBaseUrl,
      nowday: options.nowday,
      "po.homeworkDate": options.nowday,
    })
    //存在作业记录,必须设置id
    if(options.id) {
      this.setData({
        "po.id": options.id,        
      })
    }
    //没有作业记录,说明是第一次提交，设定默认初始值
    else {
      this.setData({
        //正在完成中状态
        "po.status": 3,
        "po.content": "",
      })
    }  
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
          height: Math.ceil(tempFilePaths.length / 3), 
        })
      }
    })
  }
  deleteImg(e) {
    let delIndex = e.currentTarget.dataset.index
    this.data.postList.splice(delIndex, 1)
    this.setData({
      postList: this.data.postList,
      height: Math.ceil(this.data.postList.length / 3),
    })
  }
  //递归上传
  executeUpload(url, index, that) {
    if(index == that.data.postList.length) {    
      if(that.data.content != "") {
        //输入内容不为空
        that.setData({
          "po.content": that.data.content,
        })
      }     
      console.log(that.data.po)
      that.$post('/v1/homework/addto', that.data.po).then(data => {
        if(data.msg == "SUCC") {
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
        that.data.po.imageList.push({photoPath: JSON.parse(res.data).obj})
        that.setData({
          "po.imageList": that.data.po.imageList,
        });
        that.executeUpload(url, index + 1, that)
      }
    })
  }

  postConfirm() {
    var that = this
    if(that.data.postList.length == 0 && !that.data.content) {
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
        if(res.confirm) {
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
  bindInput(e) {
    this.setData({      
      content: e.detail.value,
    });
  }
  //预览图片
  imgPreview(e) {
    let that = this;
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: that.data.postList
    });
  }
}