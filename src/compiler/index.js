const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


function start (tagName, attrs) {
  console.log(tagName, attrs, 'start')
}

function end (tagName) {
  console.log(tagName, 'end')
}

function chars (text) {
  console.log(text, 'text')
}

function parseHTML (html) {

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

}


export function compileToFunctions(template) {
  parseHTML(template)
}