import { COLORANT }               from '@palett/enum-colorant-modes'
import { fluoVec }                from '@palett/fluo-vector'
import { LAVA, METRO }            from '@palett/presets'
import { Deco as DecoString }     from '@spare/deco-string'
import { Deco as DecoVector }     from '@spare/deco-vector'
import { zipper }                 from '@vect/vector-zipper'
import { sync as syncBrotliSize } from 'brotli-size'
import fileSize                   from 'filesize'
import gzip                       from 'gzip-size'
import { minify }                 from 'terser'

/**
 *
 * @param {OutputChunk} bundle
 * @param {Object} p
 * @param {Object} [p.format]
 * @param {Function} [p.render]
 * @param {Object} [p.preset]
 * @param {boolean} [p.showGzipped=true]
 * @param {boolean} [p.showBrotli=true]
 * @param {boolean} [p.showMinified=true]
 * @return {Object}
 */
export const sizeInfo = function (bundle, p) {
  const { code, fileName } = bundle, { format } = p
  const minifiedCode = minify(code).code
  const info = {}
  const sizes = { bundle: fileSize(Buffer.byteLength(code), format) }
  if (p.showBrotli) Object.assign(sizes, { brotli: fileSize(syncBrotliSize(code), format) })
  if (p.showMinified) Object.assign(sizes, { min: fileSize(minifiedCode.length, format) })
  if (p.showGzipped) Object.assign(sizes, { gzip: fileSize(gzip.sync(minifiedCode), format) })

  info['file'] = decoFileName(fileName)
  info[decoNames(Object.keys(sizes))] = decoSizeValues(Object.values(sizes), p.preset)

  return p.render ? p.render(info) : info
}

const KB = /\s+KB/gi

/** @type {Function} */export const decoFileName = DecoString({ presets: [undefined, { preset: METRO }] })

export const decoNames = DecoVector({ indexed: false, delim: '/', presets: [undefined, { preset: LAVA }] })

export const decoSizeValues = (values, preset) => {
  const colorants = fluoVec.call(COLORANT, values.map(x => +x.replace(KB, '')), [undefined, { preset }])
  return zipper(values, colorants, (v, d) => d(v))
}
