import observer from './observer/index'
import { nextTick } from "./util/index";
import Watcher from "./observer/watcher"


function proxy (vm, data, key) {
  Object.defineProperty(vm, key, {
    get () {
      return vm[data][key]
    },
    set (newValue) {
      vm[data][key] = newValue
    }
  })
}


export function initState (vm) {
  const opts = vm.$options

  if (opts.props) {
    initProps(vm)
  }

  if (opts.data) {
    initData(vm)
  }

  if (opts.watch) {
    initWatch(vm)
  }

  if (opts.computed) {
    initComputed(vm)
  }

  if (opts.methods) {
    initMethods(vm)
  }
}

function initProps () {}
function initData (vm) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data

  // 做一个代理 方便 vm.a  直接 实例.属性
  for (let key in data) {
    proxy(vm, '_data', key)
  }

  observer(data)
}
function initWatch (vm) {
  const watch = vm.$options.watch
  for (let key in watch) {
    // handler 可能是 数组、字符串、对象、函数
    const handler = watch[key]

    if (Array.isArray(handler)) {
      handler.forEach(handle => createWatcher(vm, key, handle, { user: true }))
    } else {
      createWatcher(vm, key, handler, { user: true })
    }
  }
}
function initComputed () {}
function initMethods () {}

export function stateMixin (Vue) {
  Vue.prototype.$nextTick = function (cb) {
    nextTick(cb)
  }

  Vue.prototype.$watch = function (exprOrFn, cb, options) {
    console.log(exprOrFn, cb, options)
    // 数据应该依赖这个 watcher 数据变化后应该通知 watcher 重新执行  用户 watcher
    const watcher = new Watcher(this, exprOrFn, cb, { ...options, user: true })

    if (options.immediate) {
      cb()
    }
  }
}



// vm  vue 实例对象
// exprOrFn watch 的函数名
// handler  watch 的回调（可能是数组，有多个回调，函数，对象）
// options => deep: true  sync: true  immediate: true
function createWatcher (vm, exprOrFn, handler, options) {
  if (typeof handler === 'object') {
    for (let key in handler) {
      if (key !== 'handler') {
        options[key] = handler[key]
      }
    }
    handler = handler.handler
  }

  if (typeof handler === 'string') {
    handler = vm[handler]
  }

  // 前面是做兼容，之后统一使用 $watch 去实现
  return vm.$watch(exprOrFn, handler, options)
}