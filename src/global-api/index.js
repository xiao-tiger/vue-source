import { mergeOptions } from '../util/index'

export function initGlobalApi (Vue) {

  // 全局定义的属性，都会放在 Vue.options 中，
  // 当你在 new Vue 的时候，就要把传入的 options 合并到 Vue.options 中
  Vue.options = {}  

  Vue.mixin = function (mixin) {

    // 将 mixin 中的属性合并到 Vue.options 中
    this.options = mergeOptions(this.options, mixin)
  }
}
