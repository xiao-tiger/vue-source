{/* <div style="color:red">hello {{name}} <span></span></div>
render(){
   return _c('div',{id: 'app', style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
} */}


const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g  // 用来匹配 {{  }}

function genProps(attrs) {
  let str = ''
  attrs.forEach(item => {
    if (item.name === 'style') {
      const styleObj = {}
      item.value.split(';').forEach(iten => {
        const [key, val] = iten.split(':')
        styleObj[key] = val
      })

      str += `style: ${JSON.stringify(styleObj)},`
    } else {
      str += `${item.name}: ${JSON.stringify(item.value)},`
    }
  })

  // 去除最后一个 ,
  return str.slice(0, -1)
}

function gen(node) {
  if (node.type === 1) {
    return generate(node)
  } else {
    // 文本
    let text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    } else {
      let lastIndex = defaultTagRE.lastIndex = 0
      const tokens = []
      let match
      let index

      while (match = defaultTagRE.exec(text)) {
        index = match.index
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }

        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}


function genChildren(el) {
  let children = el.children
  if (children) {
    return `${children.map(c => gen(c)).join(',')}`
  }

  return false
}

export function generate(el) {

  let children = genChildren(el)
  let code = `_c('${el.tag}', {
    ${el.attrs.length ? `${genProps(el.attrs)}` : undefined}
  }, ${children ? children : ''})`

  return code
}
