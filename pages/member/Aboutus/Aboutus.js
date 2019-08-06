let we = require('../../../we/index.js')
new class extends we.Page {
  makePhone(){
	  wx.makePhoneCall({
		  phoneNumber: '18872208938' //仅为示例，并非真实的电话号码
	  })
  }
  
}