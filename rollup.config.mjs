import { nodeResolve }                 from '@rollup/plugin-node-resolve'
import fs                              from 'fs'
import { decoObject, decoString, ros } from '@spare/logger'
import { fileInfo }                    from './dist/index.mjs'

const packageJson = fs.readFileSync(process.cwd() + '/package.json', { encoding: 'utf-8' })
const { dependencies, exports, name } = JSON.parse(packageJson)

console.log(ros('Executing'), name, decoString(process.cwd()))
if (dependencies) console.log(ros('Dependencies'), decoObject(dependencies))

export default {
  input: 'index.js',
  external: Object.keys(dependencies || {}),
  output: [
    { file: exports['import'], format: 'esm', exports: 'named' },  // ES module (for bundlers) build.
    { file: exports['require'], format: 'cjs', exports: 'named' }  // CommonJS (for Node) build.
  ],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    fileInfo(),
  ]
}
