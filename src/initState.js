import observer from './observer/index'

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
function initWatch () {}
function initComputed () {}
function initMethods () {}