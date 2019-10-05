let we = require('../../../we/index.js');

new class extends we.Page {
  data() {
    return {
      ofuser: [],
      parentPhone: "",
      imgBaseUrl: "",
      id: "",
      dialog: false,
      showChild: false,
      showParent: false,
      showChildtext: false,
      showParenttext: false,
      check: false,
      childValue: "",
      parentValue: "",
      birthday:"2000-01-01",
      promptTxt: "",
      promptDisplay: "",
      index:"",
      po: {
        "code": "",
        "activityid": "",
        "phone": "",
        "familys": [],
        "students": [],
      },
      totalPrice: "0.00",
      feed: {
        titlePhoto: "",
        heading: "",
        remains: "",
        familyPrice: "",
        studentPrice: "",
        familyEnable:"",
        phone:""
      },
      //订单号
      orderId: null,
    }
  }
  //事件处理函数
  onLoad(options) {
    var noticeid = options.id;
    this.setData({
      feed: {
        titlePhoto: options.titlePhoto,
        heading: options.heading,
        remains: options.remains,
        familyPrice: options.familyPrice,
        studentPrice: options.studentPrice,
        familyEnable: options.familyEnable,
        phone: options.phone,
        orderId: options.orderid,
      },
    })
    var that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          that.setData({
              "po.code": res.code,
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    this.setData({
      imgBaseUrl: this.$app.imgBaseUrl,
      "po.activityid": noticeid,
    })
  }

  onShow() {
    if (this.$app.userdtatus == 103 && this.$app.userType == '家长') {
      this.$get('/v1/activity/findStudentOfUser').then(data => {
        this.setData({
          ofuser: data.obj
        })
        if (data.obj.phone) {
          this.setData({
            "po.phone": data.obj.phone
          })
        }
        if (data.obj.students.length != 0) {
          this.setData({
            "po.students": data.obj.students,
            "totalPrice": this.data.feed.studentPrice * this.data.po.students.length + this.data.feed.familyPrice * this.data.po.familys.length
          })
          var totalPrice = this.data.feed.studentPrice * this.data.po.students.length + this.data.feed.familyPrice * this.data.po.familys.length;
          this.setData({
            "totalPrice": totalPrice,
            showChildtext: true,
          })
        }
      }).catch(err => {
        console.log(err)
        this.$showModal({
          title: '获取信息错误',
          content: err.msg,
          showCancel: false
        })
      })
    } else {

    }
  }

  bindStudentname(e) {
    this.setData({
      "childValue": e.detail.value,
    });
  }
  bindFamilyname(e) {
    this.setData({
      "parentValue": e.detail.value,
    });
  }
  bindPhone(e) {
    this.setData({
      'po.phone': e.detail.value,
    });
  }
	bindDateChange(e) {
	//var index = e.currentTarget.dataset.index;
    this.setData({
      birthday: e.detail.value,
    })
  }

  Landcode() {
    console.log(this.data.po)
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (this.data.po.students.length == 0) {
      this.setData({
          'promptTxt': "请您添加孩子姓名",
          'promptDisplay': "block"
      });
      setTimeout(function() {
          this.setData({
              promptDisplay: "none"
          });
      }.bind(this), 3000)
    } else if (!this.data.po.phone) {
        this.setData({
            'promptTxt': "请输入您的手机号",
            'promptDisplay': "block"
        });
        setTimeout(function() {
            this.setData({
                promptDisplay: "none"
            });
        }.bind(this), 3000)
    } else if (!myreg.test(this.data.po.phone)) {
        this.setData({
            'promptTxt': "手机号输入错误",
            'promptDisplay': "block"
        });
        setTimeout(function() {
            this.setData({
                promptDisplay: "none"
            });
        }.bind(this), 3000)

    } else if (this.data.po.students.length > this.data.feed.remains){
        this.setData({
          'promptTxt': "已超过剩余名额",
          'promptDisplay': "block"
        });
        setTimeout(function () {
          this.setData({
            promptDisplay: "none"
          });
        }.bind(this), 3000)
    } else {
        this.Landing()
    }
  }

  Landing() {
    //console.log(this.data.po)
    if (this.data.orderId != null) {
      this.$post
    } else {
      this.$post('/v1/activity/enrollActivity', this.data.po).then(data => {
        console.log(data);
        this.setData({
          orderId: data.obj.orderId,
        });
        var that = this;
        if (data.msg == "SUCC") {
          wx.requestPayment({
            'timeStamp': data.obj.data.timeStamp,
            'nonceStr': data.obj.data.nonceStr,
            'package': data.obj.data.package,
            'signType': data.obj.data.signType,
            'paySign': data.obj.data.paySign,
            'success': function (res) {
              wx.navigateTo({
                url: '../success/success?id=' + that.data.orderId,
              });
            },
            'fail': function (res) {
              wx.navigateTo({
                url: '../fail/fail',
              })
            },
            'complete': function (res) { }
          })
        } else if (!data.obj) {
          that.$showModal({
            title: '错误',
            content: '报名失败',
            showCancel: false
          })
        } else {
          
        }
      }).catch(err => {
        this.$showModal({
          title: '提示',
          content: err.msg,
          showCancel: false
        })
      })
    }
    
  }

  addChild() {
    this.setData({
      dialog: true,
      showChild: true,
      showParent: false,
      childValue: "",
      check: false,
    })
  }

  enterChild() {
		if (this.data.childValue){
			if(!this.data.check){
				this.data.po.students.push({
					"name": this.data.childValue,
					"birthday": "2008-10-01"
				})
			}else{
				var s = 'po.students[' + this.data.index + '].name';
				var d = 'po.students[' + this.data.index + '].birthday';
				this.setData({
					[s]: this.data.childValue,
					[d]:this.data.birthday
				})
			}
			this.setData({
				dialog: false,
				showChild: false,
				showChildtext: true,
				"po.students": this.data.po.students
			})
		}else{
			this.setData({
				'promptTxt': "请您添加孩子姓名",
				'promptDisplay': "block"
			});
			setTimeout(function () {
				this.setData({
					promptDisplay: "none"
				});
			}.bind(this), 3000)
		}
       
    var totalPrice = this.data.feed.studentPrice * this.data.po.students.length + this.data.feed.familyPrice * this.data.po.familys.length;
    this.setData({
      "totalPrice": totalPrice,
      check: false,
    })
  }

	closeChild(){
    let that = this
		this.setData({
			dialog: false,
			showChild: false,
			showChildtext: true,
			check: false,
		})
		if (that.data.po.students.length == 0) {
			that.setData({
				showChildtext: false,
			})
		}
	}

  addParent() {
    this.setData({
      dialog: true,
      showParent: true,
      showChild: false,
      parentValue: "",
      check: false,
    })
  }

  enterParent() {
		if (this.data.parentValue) {
			if(!this.data.check){
				this.data.po.familys.push({
					"name": this.data.parentValue,
				})
			}else{
				var s = 'po.familys[' + index + '].name';
				this.setData({
					[s]: this.data.parentValue
				})       
			}
			this.setData({
				dialog: false,
				showParent: false,
				showParenttext: true,
				"po.familys": this.data.po.familys
			})
		} else {
			this.setData({
				'promptTxt': "请您添加家长姓名",
				'promptDisplay': "block"
		  });
      setTimeout(function () {
        this.setData({
          promptDisplay: "none"
        });
      }.bind(this), 3000)
	  }

		var totalPrice = this.data.feed.studentPrice * this.data.po.students.length + this.data.feed.familyPrice * this.data.po.familys.length;
		this.setData({
			"totalPrice": totalPrice,
			check: false,
		})     
  }

	closeParent() {
		this.setData({
			dialog: false,
			showParent: false,
			showParenttext: true,
			check: false,
		})
		if (this.data.po.familys.length == 0) {
			this.setData({
				showParenttext: false,
			})
		}
	}

  deledeteChild(e) {
    var index = e.currentTarget.dataset.index;
		var that = this;
		wx.showModal({
			title: '提示',
			content: '是否删除该孩子？',
			success(res) {
				if (res.confirm) {
					that.data.po.students.splice(index, 1);
					that.setData({
						"po.students": that.data.po.students,
					})
					var totalPrice = that.data.feed.studentPrice * that.data.po.students.length + that.data.feed.familyPrice * that.data.po.familys.length;
					that.setData({
						"totalPrice": totalPrice,
					})
					if (that.data.po.students.length == 0) {
						that.setData({
							showChildtext: false,
						})
					}
				} else if (res.cancel) {
				}
			}
		})
  }

  deledeteParent(e) {
    var index = e.currentTarget.dataset.index;
		var that = this; 
		wx.showModal({
			title: '提示',
			content: '是否删除该家长？',
			success(res) {
				if (res.confirm) {
					that.data.po.familys.splice(index, 1);
					that.setData({
						"po.familys": that.data.po.familys,
					})
					var totalPrice = that.data.feed.studentPrice * that.data.po.students.length + that.data.feed.familyPrice * that.data.po.familys.length;
					that.setData({
						"totalPrice": totalPrice,
					})
					if (that.data.po.familys.length == 0) {
						that.setData({
							showParenttext: false,
						})
					}
				} else if (res.cancel) {
				}
			}
		}) 
  }

  selectChild(e) {
    var index = e.currentTarget.dataset.index;
		var name = e.currentTarget.dataset.name;
		var birthday = e.currentTarget.dataset.birthday;
		this.setData({
			dialog: true,
			showChild: true,
			showParent: false,
			childValue: name,
			birthday: birthday,
			check:true,
			index: index
		})
  }

  selectParent(e) {
    var index = e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.name;
    this.setData({
      dialog: true,
      showChild: false,
      showParent: true,
      parentValue: name,
      check: true,
      index: index
    })
  }

  calling() {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.feed.phone,
    })
  }
}