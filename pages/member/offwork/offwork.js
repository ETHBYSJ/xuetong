//请假 页面
let we = require('../../../we/index.js')
new class extends we.Page {
  data() {
    return {
      studentid:"",
      record:[],
      img:'',
      name:"",
    }
  }
  onLoad(options) {
    console.log(options)
    this.setData({
      studentid: options.studentid,
      img: options.img,
      name: options.name,
    })
  }
  
}