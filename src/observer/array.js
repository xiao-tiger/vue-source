let oldArrayProtoMethods = Array.prototype


// 继承数组的原生方法
export let arrayMethods = Object.create(oldArrayProtoMethods) 


const methods = ['push', 'shift', 'unshift', 'pop', 'splice', 'reverse', 'sort']


methods.forEach(method => {
  arrayMethods[method] = function (...args) {

    // 当前的 this 就是  data.__proto__ = arrayMethods 中的 data
    let inserted = null
    let ob = this.__ob__

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        // [].splice(1, 0, {}, {})   获取到 从第三个参数后面所有的参数
        inserted = args.slice(2)
        break
      default:
        break
    }

    // 监测 新增的数据  怎么拿到 new Observer().observerArray 这个方法了，
    // 重写一个，那好low啊，源码是定义了一个不可枚举的 __ob__ 属性，指向 Observer 实例
    if (inserted) ob.observerArray(inserted)

    const result = oldArrayProtoMethods[method].apply(this, args)

    ob.dep.notify()   // 通知数组更新
    return result
  }
})

