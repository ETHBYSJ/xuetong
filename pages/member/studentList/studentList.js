let we = require('../../../we/index.js')

new class extends we.Page {
  data() {
    return {
      vo: {
        //'BackgroundImg': 'http://pic.616pic.com/bg_w1180/00/11/52/pKsDC2YqzS.jpg!/fh/300',
        message: {},
        stuList: [],
      },
      userType: "",
      stuList: [],
    }
  }

  onShow(){   
    this.setData({
      'userType': this.$app.userType,
      'vo.imgBaseUrl': this.$app.imgBaseUrl,
      
    })

    if (this.$app.userType == '教职工') {
      this.loadTechInfo();
    } else {
      this.loadInfo();
    }
  }


  loadStuInfo(gradeId, clazzId) {
    this.$get('/v1/student/datalist?gradeId=' + gradeId +'&clazzId='+ clazzId).then(data => {
      data.obj.forEach(e => {
        this.data.vo.stuList.push({
          'name': e.name,
          'photo': e.photo,
        });
        this.setData({
          'stuList': this.data.vo.stuList, 
        })
      })
    })
  }

  loadTechInfo() {
    this.$get('/v1/teacher/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })

      for (let i = 0; i < data.obj.webchatClazzList.length; ++i) {
        this.loadStuInfo(data.obj.webchatClazzList[i].gradeid,
                         data.obj.webchatClazzList[i].clazzid);
      }
      //console.log(data);
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }

  loadInfo() {
    this.$get('/v1/family/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })
      console.log(data);
    }).catch(err => {
      this.$showModal({
        title: '获取信息错误',
        content: err.msg,
        showCancel: false
      })
    })
  }
}