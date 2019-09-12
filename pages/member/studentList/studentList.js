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
      fixedTitle: '',
      scroolHeight: 0,
      oHeight: [],
      toView: 'page_header'
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

  scrollToViewFn(e) {
    //console.log(e.target.dataset.id);
    var id = e.target.dataset.id;
    this.setData({
      'isActive': id,
      'toView': 'inToView' + id,
    })
    //console.log(this.data.toView)
  }
  
  onPageScroll(e) {
    //console.log(e)
    this.setData({
      'scroolHeight': e.detail.scrollTop,
    })
    if (e.detail.scrollTop < 35) {
      for (let i in this.data.sortList) {
        if (this.data.sortList[i].active==true) {
          this.setData({
            'isActive': this.data.sortList[i].id,
          })
          break;
        }
      }
    } else {
      for (let i in this.data.oHeight) {
        console.log('Go to ' + this.data.oHeight[i].name);
        if (e.detail.scrollTop < this.data.oHeight[i].height) {
          this.setData({
            'isActive': this.data.oHeight[i].key,
            'fixedTitle': this.data.oHeight[i].name,
          });
          return false;
        }
      }
    }
    
  }

  loadTechInfo() {
    wx.showLoading({
      title: '加载中',
    })
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

      })
      .then(stuList => { //初始化排序队列
        /*console.log(stuList_date);*/
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
              'id': i, 
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
        var number = 35;
        for (let i = 0; i < sor.length; ++i) {
          number = sor[i].items.length * 60 + number + (sor[i].items.length==0 ? 0 : 30);
          var newArr = [{ 'height': number, 'key': sor[i].id, 'name': sor[i].region}];
          this.setData({
            'oHeight': this.data.oHeight.concat(newArr),
          })
        }
        //console.log(this.data.oHeight);
        this.setData({
          'sortList': sor,
        });

        wx.hideLoading();
        //console.log(sor);
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