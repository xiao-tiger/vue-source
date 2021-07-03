export function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    vm.$el = path(vm.$el, vnode)
  }
}

// 将虚拟dom 更新为 真实dom
function path (oldVnode, vnode) {
  const isRealElement  = oldVnode.nodeType
  if (isRealElement) {
    const el = createEle(vnode)

    const oldVNodeParent = oldVnode.parentNode  // body
    // 这里不可以茫然的 removeChild 和 appendChild   因为 body 里面还有其他的元素
    oldVNodeParent.insertBefore(el, oldVnode.nextSibling)
    oldVNodeParent.removeChild(oldVnode)
    return el
  }
}

function createEle (vnode) {
  const { tag, key, data, children, text } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    children.forEach((child) => {
      vnode.el.appendChild(createEle(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}



export function mountComponent (vm, el) {


  // 调用 render 方法创建 虚拟节点，再将虚拟节点渲染到页面上  Vue核心再次
  vm._update(vm._render())
}