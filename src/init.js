import { initState } from './initState'
import { compileToFunctions } from './compiler/index'
import { mountComponent } from './lifecycle'


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

    const vm = this
    const options = vm.$options

    // 渲染优先级  render > template > el
    // 不管用户怎么写模板语法，我们都是用 ast 抽象语法树，将其解析成 render 方法，保持统一
    // 不然你需要写一个针对 render 解析的方法 和 一个针对 template 解析的方法
    if (!options.render) {
      // 没有 render 就将 template 转换成 render
      let template = options.template
      if (!template && el) {
        // template 不存在  el存在   
        template = el.outerHTML  // 拿到 el 包含自己和所有儿子的节点
        // 这样就统一使用 render 来解析语法树了
        const render = compileToFunctions(template)
        options.render = render
      }
    }
    vm.$el = el

    // 将当前的实例挂载到 el 上面去
    mountComponent(vm, el)
  }
}
