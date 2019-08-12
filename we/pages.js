let utils = require('./utils.js')

class Pages {
    constructor() {
        this.$app = Pages.global.app
        //添加we中的成员至this中，并将‘成员’改为‘$成员’
        utils.mixWxApi(this, Pages.global)

        Page(Object.assign({
            onLoad: onLoad.call(this),
            data: this.data ? this.data() : {}
        }, utils.getClassMethods(this, ['data', 'onLoad'])))
    }
    setData(obj) {
        this.$page.setData(obj)
    }
}
/*
P={$x=we.x}
P {p}
p={a,b}
P.onXX->p.onXX
we.p = P
调用new we.p
*/
function onLoad() {
    let context = this

    return function (options) {
        context.$page = this
        //??????????
        context.data = this.data

        if (context.onLoad) {
            context.onLoad(options)
        }
    }
}

Pages.global = {}
module.exports = Pages