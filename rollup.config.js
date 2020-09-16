import commonjs       from '@rollup/plugin-commonjs'
import nodeResolve    from '@rollup/plugin-node-resolve'
import { decoObject } from '@spare/logger'
import fileInfo       from './index'

const { name, dependencies, main, module } = require(process.cwd() + '/package.json')

console.log('Executing', name, process.cwd())
console.log('Dependencies', decoObject(dependencies))

export default [
  {
    input: 'index.js',
    external: Object.keys(dependencies || {}),
    output: [
      { exports: 'default', file: main, format: 'cjs' },  // CommonJS (for Node) build.
      // { file: module, format: 'esm' }  // ES module (for bundlers) build.
    ],
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs({ include: 'node_modules/**' }),
      fileInfo(),
    ]
  }
]
