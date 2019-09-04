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
        //createDate: "",
        studentId: "",
        //content: "",
        //status: 1,
        //chineseFeedback: "",
        //mathFeedback: "",
        //englishFeedback: "",
        //otherFeedback: "",
        //chineseStatus: -1,
        //mathStatus: -1,
        //englishStatus: -1,
        //otherStatus: -1,
        homeworkDate: "",
        deleteTag: 1,
      },
    }
  }
  onLoad(options) {
    console.log(options)
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
        /*
        "po.chineseStatus": -1,
        "po.mathStatus": -1,
        "po.englishStatus": -1,
        "po.otherStatus": -1,
        */
        //正在完成中状态
        "po.status": 3,
      })
    }    
    //console.log(this.data.imgBaseUrl)
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
        //console.log(that.data.postList)
        //that.complaint()
      }
    })
  }
  deleteImg(e) {
    /*
    console.log("delete")
    console.log(e)
    */
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
        that.setData({
          "po.content": that.data.content,
        })
      }
      console.log(that.data.po)      
      that.$post('/v1/homework/update', that.data.po).then(data => {
        console.log(data) 
        wx.navigateBack({
          delta: 1
        })       
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
        console.log(index)
        console.log(res)      
        that.data.po.imageList.push({photoPath: JSON.parse(res.data).obj})
        console.log(that.data.po.imageList)
        that.setData({
          "po.imageList": that.data.po.imageList,
        })  
        console.log(that.data.po)
        that.executeUpload(url, index + 1, that)
      }
    })
  }

  postConfirm() {
    var that = this
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
          })

          that.setData({
            "po.imageList": [],
          })
          that.executeUpload(that.data.imgBaseUrl + '/v1/homework/upload', 0, that)
        }        
      }
    })    
  }
  bindInput(e) {
    this.setData({
      //"po.content": e.detail.value,
      content: e.detail.value,
    })
  }
  //预览图片
  imgPreview(e) {
    let that = this
    let src = e.currentTarget.dataset.src;
    console.log(e)
    wx.previewImage({
      current: src,
      urls: that.data.postList
    })
  }
}