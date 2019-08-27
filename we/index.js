let Pages = require('./pages.js')
let utils = require('./utils.js')
let request = require('./request.js')
let navigateTo = require('./navigateTo.js')
let redirectTo = require('./redirectTo.js')
let Application = require('./application.js')

let config = {
    http: {
		  //root: 'https://www.xuetong360.com',
		  root: 'https://xue.xuetong360.com',
		  //root: 'https://localhost',
      
        header: {},
        duration: 1,
        timestamp: false,
        error: (message) => {
            we.showModal({content: message, title: "网络错误", showCancel: true})
        }
    },
    router: {
        maps: {}
    }
}

//图片默认路径
//let imgBaseUrl = 'https://www.xuetong360.com'
let imgBaseUrl = 'https://xue.xuetong360.com'
//let imgBaseUrl = 'https://localhost'
function we(obj = {}) {
    we.request = request(Object.assign({}, config.http, obj.http))
    we.navigateTo = navigateTo(Object.assign({}, config.router, obj.router))
    we.redirectTo = redirectTo(Object.assign({}, config.router, obj.router))
    Pages.prototype.$post = http('POST')
    Pages.prototype.$get = http('GET')
    Pages.prototype.$put = http('PUT')
    Pages.prototype.$PATCH = http('PATCH')
    Pages.prototype.$DELETE = http('DELETE')
    Pages.prototype.$getSession = getSession
    Pages.prototype.$getEnum = getEnum
    Pages.prototype.$getEnumName = function (enumName, enumValue) {
        let values = getEnum(enumName)
        let name = null
        for (let item of values) {
            if (item.value == enumValue) {
                name = item.name
                break
            }
        }
        return name
    }
    Pages.prototype.$imgUrl = imgUrl

    Application.prototype.$post = http('POST')
    Application.prototype.$get = http('GET')
    Application.prototype.$PUT = http('PUT')
    Application.prototype.$PATCH = http('PATCH')
    Application.prototype.$DELETE = http('DELETE')
    Application.prototype.$getSession = getSession
}

//将wx中的on sync等方法copy到we中
utils.toPromise(we, wx)
/*
we.request = request(config.http)
we.navigateTo = navigateTo(config.router)
we.redirectTo = redirectTo(config.router)
*/

we.Page = Pages
we.App = Application

Pages.global = we
Application.global = we

module.exports = we

let imgUrl = (data, key) => {
  if (!data || (!key && !data.length)) {
    return data;
  }
  if (data.length) {
    for (let i = 0; i < data.length; i++) {
      let str = key ? data[i][key] : data[i];
      if (str && str.indexOf("http") == -1 && str.indexOf("https") == -1) {
        str = imgBaseUrl + str;
        key ? (data[i][key] = str) : (data[i] = str)
      }
    }

  } else {
    let str = key ? data[key] : data;
    if (str && str.indexOf("http") == -1 && str.indexOf("https") == -1) {
      str = imgBaseUrl + str;
    }
    key ? (data[key] = str) : (data = str)
  }
  return data;
}

let getSession = ()=> {
    return new Promise((rev, rej)=> {
        let sessionData = wx.getStorageSync("__session__")
        if (sessionData) {// && sessionData.endDate && sessionData.endDate > Date.now()
            rev(sessionData)
        } else {
            wx.getSystemInfo({
                success: function (systemInfo) {
                  http('POST')('/v1/session/fetchSession', {
                        "appId": "miniapp_member",
                        "md5": "NIU99JKDS86TY65",
                        "appVersion": "0.0.1",
                        "osType": systemInfo.platform,
                        "osVer": "11.1.2",
                        "unitType": `${systemInfo.brand}-${systemInfo.model}`
                    }).then(res=> {
                        let data = res.obj
                        // data.endDate = Date.parse(data.endDate.substr(0, 4) + '-' + data.endDate.substr(4, 2) + '-' + data.endDate.substr(6))
                        wx.setStorageSync("__session__", data)
                        console.info("===========session=============", data, "========================")
                        rev(data)
                    }).catch(err=> {
                        wx.showModal({
                            title: "建立Session出错",
                            content: err.message,
                            showCancel: true
                        })
                    })
                }
            })
        }
    })
}

let http = (method = 'GET') => {
    return (url, data = {}, header = {}) => {
      header['X-Session-Token'] = wx.getStorageSync("__session__")
        return we.request({
            url: url,
            header,
            method,
            data: data,
            duration: 1,
        }).then(res => {
            //console.log(res.data)
            if (typeof res.data == 'string') {
                res.data = JSON.parse(res.data)
            }
            if (res.data.code === 0) {
                return Promise.resolve(res.data)
            } else
             if (res.data.code === 2 || res.data.code === 3) {
                wx.removeStorage({key: '__session__'})
                return Promise.reject({message: 'session失效,请重启小程序'})
            } else {
                return Promise.reject({message: res.data})
            }
        }, err=> {
            return Promise.reject({message: err.msg})
          })
    }
}

let getEnum = function (enumName) {
    let allEnums = wx.getStorageSync("__allEnums__")
    for (let enumItem of allEnums) {
        if (enumItem.type == enumName) {
            return enumItem.values
        }
    }
    return []
}