const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseHTML (html) {

  function createASTElement (tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs,
      parent: null
    }
  }

  let root
  let currentParent  // 记录当前元素的父元素是谁
  let stack = []   // 用于记录当前正在处理是哪个标签  没处理完，就剔除这个标签  
  
  function start (tagName, attrs) {
    let element = createASTElement(tagName, attrs)

    if (!root) {
      // 如果没有根节点   当前元素就是根节点
      root = element
    }

    currentParent = element   // 开始标签肯定是根节点
    stack.push(element)
  }
  
  function end (tagName) {
    // stack = [div, p]   当匹配到结束标签 </p> 的时候，就要剔除 p
    // 并且将 currentParent = div
    let element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }
  
  function chars (text) {
    // 去除空格
    text = text.replace(/\s/g, '')

    if (text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }

  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 首字符是 < 说明是开始标签
      // 解析开始标签 上面的属性 id="app"
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }

    let text
    //  hello world </div>  这样情况下  就是 textEnd > 0 匹配是文本
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }

  // 截取字符串，更新 html 内容  每次匹配完，就把匹配到结果从 html 剔除掉，减少下次匹配难度
  function advance (n) {
    html = html.substring(n)
  }

  function parseStartTag () {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)

      let end
      let attr
      // 匹配属性   不是结束标签，而且有属性
      while (!(end=html.match(startTagClose)) && (attr=html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({ name: attr[1], value: attr[3] })
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }

  return root

}