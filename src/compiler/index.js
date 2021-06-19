import { parseHTML } from './parse'

export function compileToFunctions(template) {
  const ast = parseHTML(template)
  console.log(ast, '====')

}