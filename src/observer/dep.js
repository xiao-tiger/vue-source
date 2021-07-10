
class Dep {

  constructor () {
    this.subs = []
  }

  depend () {
    // 收集依赖   Dep.target = new Watcher
    this.subs.push(Dep.target)
  }

  notify () {
    this.subs.forEach(watcher => watcher.update())
  }


}

Dep.target = null

export function pushTarget (watcher) {
  Dep.target = watcher  // 保留watcher
}

export function popTarget () {
  Dep.target = null
}


export default Dep

// 多对多的关系，一个属性有一个 dep 是用来收集 Watcher 的
// dep 可以存多个 watcher
// 一个 watcher 可以对应多个 dep
