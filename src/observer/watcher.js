import { pushTarget, popTarget } from './dep'
import { nextTick } from '../util/index'


let id = 0


class Watcher {

  // vm  Vue 的实例
  // exprOrFn  => vm._update(vm._render()) 

  constructor (vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    this.id = id++  // watcher 的唯一标识

    this.deps = []  // 记录有多少 dep 依赖 watcher
    this.depsId = new Set()

    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.get()
  }

  get () {
    // 页面渲染的时候，会走 get 方法，收集依赖，属性对应一个 Watcher 实例
    pushTarget(this)
    this.getter()
    popTarget()
  }

  run () {
    this.get()
  }

  update () {
    // 每次更新都会调用 get 方法，我们将其缓存起来，执行性一个 get
    // this.get()  // 重新渲染

    queueWatcher(this)
  }

  addDep (dep) {
    const id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }
}

let queue = []
let has = {}
let pending = false

function flushSchedulerQueue () {
  queue.forEach(watcher => { watcher.run(); watcher.cb() })
  queue = []
  has = {}
  pending = false
}


function queueWatcher (watcher) {
  const id = watcher.id  // 标识每个 watcher 的 id
  if (!has[id]) {
    // 将需要批量更新的 watcher（根据 watcher id 去重） 存到一个队列中，稍后让 watcher 执行
    // 这样就可以做到 批量更新 只更新一次
    queue.push(watcher)
    has[id] = true

    // 这里我们去调用  vm.update(vm.render()) 方法
    // 但是我们可以等待所有同步操作结束，再去异步的更新dom，执行所有的watcher
    // 防抖
    if (!pending) {
      // 抽离异步更新方法
      nextTick(flushSchedulerQueue)
      // setTimeout(() => {
      //   queue.forEach(watcher => watcher.run())
      //   queue = []
      //   has = {}
      //   pending = false
      // }, 0)
      pending = true
    }
  }
}

export default Watcher


// 在数据劫持的时候，定义 defineProperty 的时候 已经给每个属性都增加了一个 dep

// 1. 把这个渲染 watcher 放到 Dep.target 属性上
// 2. 开始渲染 取值会调用 get 方法，需要让这个属性的 dep 存储当前的 watcher
// 3. 页面上所需要的属性都会将这个 watcher 存在自己的 dep 中
// 4. 等会属性更新了  就重新调用渲染逻辑 通知自己存储的 watcher 来更新
