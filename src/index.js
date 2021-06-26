import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vdom/index'

function Vue (options) {
  // 入口， 初始化options数据
  // 因为每个组件都有初始化的过程，所以建议抽出一个公共的方法，插件，提供给大家使用
  this._init(options)    
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)


export default Vue
