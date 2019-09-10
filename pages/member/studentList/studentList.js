let we = require('../../../we/index.js')
let py = require('../../../utils/pinyin.js')

new class extends we.Page {
  data() {
    return {
      vo: {
        //'BackgroundImg': 'http://pic.616pic.com/bg_w1180/00/11/52/pKsDC2YqzS.jpg!/fh/300',
        message: {},
        
      },
      userType: "",
      stuList: [],
      sortList: [],
      isActive: null,
      fixedTitle: null,
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

  //点击学生转到新页面
  /*
  bindStudy(e) {
    wx.navigateTo({
      url: '/pages/member/newStudy/newStudy?id=' + e.target.dataset.id + '&name=' + e.target.dataset.name,
    })
  }*/

  //点击右边导航字母
  scrollToViewFn(e) {
    this.setData({
      'isActive': e.target.dataset.id,
      'fixedTitle': e.target.dataset.region,
    });
  }
  
  loadTechInfo() {
    var ps1 = this.$get('/v1/teacher/getInfo').then(data => {
      this.setData({
        'vo.message': data.obj
      })
      //塞入队列
      let http_list = [];
      for (let i = 0; i < data.obj.webchatClazzList.length; ++i) {
        let gradeId = data.obj.webchatClazzList[i].gradeid;
        let clazzId = data.obj.webchatClazzList[i].clazzid;
        http_list.push(new Promise((resolve, reject)=>{
          this.$get('/v1/student/datalist?gradeId=' + gradeId + '&clazzId=' + clazzId).then(res => {
            resolve(res.obj)
          }).catch(err => {
            reject(err)
          })
        }));
      }

      Promise.all(http_list).then(values => {
        let stuList = [];
        for(let index in values) {
          stuList = stuList.concat(values[index]);
        }
        this.setData({
          'stuList': stuList,
        })

        return Promise.resolve(stuList);

      }).then(stuList => { //初始化排序队列
        let tmp = stuList;
        let sor = [];
        for (let i = 0; i < 27; ++i) {
          if (i < 26) {
            sor.push({
              'id': i,
              'active': false,
              'region': String.fromCharCode(i + 65),
              'items': [],
            })
          } else {
            sor.push({
              'active': false,
              'region': "#",
              'items': [],
            })
          }
        }
        //提取首字母
        tmp.forEach(e => {
          let head_char = py.pinyin.getCamelChars(e.name).toUpperCase()[0];
          if (head_char == undefined || head_char > 'Z' || head_char < 'A') {
            sor[26].items.push(e);
            sor[26].active = true;
          } else {
            let ascii = head_char.charCodeAt();
            sor[ascii - 65].items.push(e);
            sor[ascii - 65].active = true;
          }
        });

        return Promise.resolve(sor);
      }).then(sor => {
        this.setData({
          'sortList': sor,
        });
        console.log(sor);
      }).catch(err => {
        this.$showModal({
          title: '获取信息错误',
          content: err.msg,
          showCancel: false
        })
      })
      //console.log(data);
    }).catch (err => {
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