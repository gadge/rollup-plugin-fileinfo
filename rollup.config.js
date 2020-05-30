import commonjs       from '@rollup/plugin-commonjs'
import nodeResolve    from '@rollup/plugin-node-resolve'
import { decoObject } from '@spare/logger'
import { fileInfo }   from './src/fileInfo'

const { name, dependencies, main } = require(process.cwd() + '/package.json')

console.log('EXECUTING', name, process.cwd())
console.log('Dependencies', decoObject(dependencies))

export default [
  {
    input: 'index.js',
    external: Object.keys(dependencies || {}),
    output: [
      { file: main, format: 'cjs' },
    ],
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs({ include: 'node_modules/**' }),
      fileInfo(),
    ]
  }
]
