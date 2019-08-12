let utils = require('./utils.js')

class Application {
    constructor() {
        //添加we中的成员至this中，并将‘成员’改为‘$成员’
        utils.mixWxApi(this, Application.global)
        //添加上个函数中缺失的app成员至this.$app
        Application.global.app = this.$app = this
        //?
        Object.assign(this, this.data ? this.data() : {})
        //构建App
        App(utils.getClassMethods(this, ['data']))
    }
}

Application.global = {}
module.exports = Application