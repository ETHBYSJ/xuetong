let we = require('../../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      studentid: "",
      name: "",
      a1: 5,
    }
  }

  onLoad(options) {
    console.log(options)
    this.setData({
      studentid: options.studentid,
      name: options.name,
    })
  }
  onShow() {
    this.$get('/v1/homework/getHomeworkList?studentId=2&page=1&size=10').then(data => {
      console.log(data)
    })
  }

}