import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'


export default {
  input: './src/index.js',
  output: {
    format: 'umd',  // 模块化类型
    file: 'dist/umd/vue.js',  // 打包后路径
    name: 'Vue',   // 打包后的全局变量的名字
    sourcemap: true
  },
  plugin: [
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.ENV === 'development'?serve({
      open: true,
      openPage: './index.html',
      port: 3000,
      contentBase: ''
    }):null
  ]
}
