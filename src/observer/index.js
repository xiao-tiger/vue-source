import { arrayMethods } from './array'
import Dep from './dep'

function observer (data) {
  if (typeof data !== 'object' || data === null) return

  new Observer(data)
}

// 观测值
class Observer {
  constructor (data) {
    // data 只能是 []  {}

    // 给所有响应式数据增加标识，并且可以在响应式上获取Observer实例上的方法
    // 不可枚举  将当前 实例 this 绑定到 data对象中
    Object.defineProperty(data, '__ob__', {
      enumerable: false,
      configurable: false,
      value: this
    })

    if (Array.isArray(data)) {
      // 我们希望调用 push shift unshift splice sort reverse pop 走自己的这些方法
      // 而不是走 Array 原生的
      // 函数劫持  切片编程
      data.__proto__ = arrayMethods

      // 如果数组中有对象，我们也要监测里面的对象
      this.observerArray(data)
    } else {
      this.walk(data)
    }
  }

  // 让对象上的所有属性依次进行观测
  walk (data) {
    const keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(data, keys[i], data[keys[i]])
    }
  }

  observerArray (value) {
    // 此时的value肯定是数组   监测数组中是对象的方法
    value.forEach(item => {
      observer(item)
    })
  }
}

function defineReactive (obj, key, value) {
  // 如果value也是对象的话，我们也需要监测
  observer(value)

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get () {
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set (newValue) {
      if (newValue === value) return
      // 如果我们设置的 newValue 也是对象的话，我们也需要监测
      observer(newValue)
      value = newValue

      dep.notify()
    }
  })
}


export default observer