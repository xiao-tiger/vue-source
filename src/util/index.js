export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]

// 策略模式  这样就不用写一大堆 if else 
const strats = {}
strats.data = function (parentValue, childValue) {
  return childValue
}
// strats.watch = function () {}
// strats.computed = function () {}

function mergeHook (parentValue, childValue) {
  // 第一次传参肯定是 undefined, xxx
  if (childValue) {
    if (parentValue) {
      return parentValue.concat(childValue)
    } else {
      return [childValue]
    }
  }

  return parentValue
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

export function mergeOptions (parent, child) {
  const options = {}

  // 合并父亲和儿子所有共同的属性
  for (let key in parent) {
    mergeField(key)
  }

  // 合并 所有儿子有 但父亲没有的属性
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  function mergeField (key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
        options[key] = {
          ...parent[key],
          ...child[key]
        }
      } else {
        options[key] = child[key]
      }
    }
  }

  return options
}

export function callHook (vm, hook) {
  const handler = vm.$options[hook]
  if (handler) {
    for (let i = 0; i < handler.length; i++) {
      handler[i].call(vm)
    }
  }
}

let callbacks = []
let pending = false

function flushCallbacks () {
  // while (callbacks.length) {
  //   const cb = callbacks.pop()
  //   cb()
  // }
  callbacks.forEach(cb => cb())
  callbacks = []
  pending = false
}

let timerFunc

if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)  // 异步处理更新
  }
} else if (setImmediate) {
  setImmediate(flushCallbacks)
} else if (MutationObserver) {
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(1)
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    textNode.textContent = 2
  }

} else {
  setTimeout(flushCallbacks)
}

export function nextTick (cb) {
  callbacks.push(cb)

  // 用户也会调用一次 $nextTick ，程序内部肯定会调用一次 nextTick ，但异步只需要一次，
  // 内部 => 用户手动调用 (执行顺序)
  if (!pending) {
    timerFunc()  // 这个方法是异步的，做了一层兼容处理，vue3就全部使用 promise
    pending = true
  }
}