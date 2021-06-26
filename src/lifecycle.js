export function lifecycleMixin (Vue) {
  Vue.prototype._update = function () {

  }
}



export function mountComponent (vm, el) {


  // 调用 render 方法创建 虚拟节点，再将虚拟节点渲染到页面上  Vue核心再次
  vm._update(vm._render())
}