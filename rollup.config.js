import commonjs            from '@rollup/plugin-commonjs'
import { nodeResolve }     from '@rollup/plugin-node-resolve'
import { decoObject, ros } from '@spare/logger'
// import { fileInfo }        from 'index.js'

const { name, dependencies, exports } = require(process.cwd() + '/package.json')

console.log(ros('Executing'), name, process.cwd())
console.log(ros('Dependencies'), decoObject(dependencies || {}, { bracket: true }))

export default {
  input: 'index.js',
  external: Object.keys(dependencies || {}),
  output: [
    { file: exports['import'], format: 'esm' },  // ES module (for bundlers) build.
    { file: exports['require'], format: 'cjs' }  // CommonJS (for Node) build.
  ],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs({ include: 'node_modules/**' }),
    // fileInfo(),
  ]
}
