module.exports = (opts) => {
    let cache = []

    return (obj) => {
        let requestId, timerId;
        let isUpload = (obj.data.uploadFile && typeof obj.data.uploadFile == 'object')

        obj.method = (obj.method || 'get').toUpperCase()
        obj.header = Object.assign({}, opts.header, obj.header)

        if (!/^https?:\/\//i.test(obj.url) && opts.root) {
            obj.url = `${opts.root}/${obj.url}`.replace(/\/{2,}/g, '/').replace(':/', '://')
        }

        requestId = `${obj.method}${obj.url}${obj.data ? JSON.stringify(obj.data) : ''}`

        if (!~cache.indexOf(requestId)) {
            cache.push(requestId)
        } else {
            if(!isUpload){
                console.error('The last request was in the pending state, not to send multiple requests')
                return new Promise(function () {})
            }else{
                console.warn('多次上传的图片是一样的')
                cache.push(requestId)
            }
        }

        /*if (obj.method === 'GET' ) {
          console.info("obj.url",obj.url)
            obj.url = `${obj.url}${obj.url.indexOf('?') < 0 ? '?' : '&'}t=${Date.now()}`
            //obj.url = `${obj.url}&
        }*/

        if (opts.duration > 0) {
            timerId = setTimeout(() => {
                wx.showToast({
                    mask: true,
                    icon: 'loading',
                    title: '获取数据中',
                    duration: 1500000
                })
            }, opts.duration)
        }
        return new Promise((resolve, reject) => {
            if (!isUpload) {
                wx.request(Object.assign({}, obj, {
                    fail(err) {
                        console.warn(err, "network error")
                        if (err.errMsg.trim() === 'request:fail') {
                            opts.error('网络错误')
                            return
                        }
                        reject({msg: err.errMsg})
                    },
                    success(res) {
                        if (res.statusCode === 404) {
                            opts.error('请求资源不存在')
                            return
                        }
                        if (`${res.statusCode}`.charAt(0) === '4') {
                            console.warn("===========network error 4xx=============")
                            console.warn("请求详情", obj)
                            console.warn("响应详情", res)
                            console.warn("===========output end=============")
                            opts.error('访问服务器出差')
                            return
                        }

                        if (`${res.statusCode}`.charAt(0) === '5') {
                            console.warn("===========network error 5xx=============")
                            console.warn("请求详情", obj)
                            console.warn("响应详情", res)
                            console.warn("===========output end=============")
                            opts.error('服务器繁忙，请稍后再试')
                            return
                        }
                        resolve(res)
                    },
                    complete() {
                        wx.hideToast()
                        clearTimeout(timerId)
                        cache.splice(cache.indexOf(requestId), 1)
                    }
                }))
            } else {
                let key, path
                for (key in obj.data.uploadFile) {
                    path = obj.data.uploadFile[key]
                    break
                }
                if (!path) {
                    console.warn("上传文件的路径不能为空:" + JSON.stringify(obj.data.uploadFile))
                    return reject({message: "上传文件的路径不能为空"})
                }

                wx.uploadFile({
                    url: obj.url,
                    name: key,
                    filePath: path,
                    header: obj.header || {},
                    formData: obj.data.data || {},
                    fail(err) {
                        if (err.errMsg.trim() === 'uploadFile:fail') {
                            opts.error('网络错误')
                            return
                        }
                        reject(err)
                    },
                    success(res) {
                        if (res.statusCode === 404) {
                            opts.error('请求资源不存在')
                            return
                        }
                        if (`${res.statusCode}`.charAt(0) === '4') {
                            console.warn("===========network error 4xx=============")
                            console.warn("请求详情", obj)
                            console.warn("响应详情", res)
                            console.warn("===========output end=============")
                            opts.error('访问服务器出差')
                            return
                        }
                        if (`${res.statusCode}`.charAt(0) === '5') {
                            console.warn("===========network error 5xx=============")
                            console.warn("请求详情", obj)
                            console.warn("响应详情", res)
                            console.warn("===========output end=============")
                            opts.error('服务器繁忙，请稍后再试')
                            return
                        }
                        resolve(res)
                    },
                    complete() {
                        wx.hideToast()
                        clearTimeout(timerId)
                        cache.splice(cache.indexOf(requestId), 1)
                    }
                })
            }
        })
    }
}