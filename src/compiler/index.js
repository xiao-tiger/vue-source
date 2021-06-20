import { parseHTML } from './parse'
import { generate } from './generate'

export function compileToFunctions(template) {
  const ast = parseHTML(template)

  // 通过这个树，重新生成代码  生成一个 render 函数
  const code = generate(ast)
  console.log(code, 'code')

}
