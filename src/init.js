import { initState } from './initState'


export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this

    vm.$options = options

    // 数据初始化，对数据进行劫持，这样当数据发生变化的时候，可以通知视图更新
    initState(vm)

    // 如果当前有 el 属性说明要渲染模板
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    // 挂载操作
    el = document.querySelector(el)
    console.log(el)
  }
}