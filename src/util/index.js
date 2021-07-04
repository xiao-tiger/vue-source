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
strats.watch = function () {}
strats.computed = function () {}

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