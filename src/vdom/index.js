export function renderMixin (Vue) {
  Vue.prototype._c = function (tag, data, ...children) {
    return createElement(tag, data, children)
  }

  Vue.prototype._s = function (value) {
    // {{ name }}
    return value === null ? '' : typeof value === 'object' ? JSON.stringify(value) : value
  }

  Vue.prototype._v = function (text) {
    return createTextNode(text)
  }

  Vue.prototype._render = function () {
    const vm = this
    // 在 $mount 函数中  已经将render绑定到options中了
    const render = vm.$options.render
    const vnode = render.call(this)
    return vnode
  }
}


function vnode (tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}

function createElement (tag, data={}, children) {
  const key = data.key
  if (key) {
    delete data.key
  }
  return vnode(tag, data, data.key, children)
}


function createTextNode (text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}