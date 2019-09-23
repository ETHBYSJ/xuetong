//answer.js
var util = require('../../utils/utilb.js');
let we = require('../../we/index.js');

new class extends we.Page {
  data() {
    return {
      feed: [],
      studentid: "",
      clazzid: "",
      date: "",
      userType:"",
      imgData:[],
      gradename:'',
    }
  }
  //事件处理函数
  onLoad(options) {
    console.log(options)
    if (options.studentid){
      this.setData({
        studentid: options.studentid,
      })
    }
    if (options.clazzid) {
      this.setData({
        clazzid: options.clazzid,
      })
    }
    if (options.gradename) {
      this.setData({
        gradename: options.gradename,
      })
    }
    
    this.setData({
      date: options.date,
      'vo.imgBaseUrl': this.$app.imgBaseUrl,
      userType:this.$app.userType,
    })
    if (this.$app.userType == '教职工') {
      this.loadTechAttend();
    } else {
      this.loadAttend();
    }

  }
  loadAttend() {
    this.$get('/v1/attendance/getStudentAttendanceEverydayList?student=' + this.data.studentid + '&date=' + this.data.date).then(data => {
      console.log(data.obj)
      var imgData = this.$imgUrl(data.obj[0].studentEverydayAttendanceVOList[0].attendanceStudentList, "photopath")
      this.setData({
        feed: data.obj[0],
        imgData: imgData
      })
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }


  loadTechAttend() {
    this.$get('/v1/attendance/getTeacherAttendanceEverydayList?clazzid=' + this.data.clazzid + '&date=' + this.data.date).then(data => {
      var imgData = this.$imgUrl(data.obj[0].teacherEverydayAttendanceVOList[0].attendanceTeacherList, "photopath")
      this.setData({
        feed: data.obj[0],
        imgData: imgData
      })

    }).catch(err => {
      console.log(err)
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }

}
