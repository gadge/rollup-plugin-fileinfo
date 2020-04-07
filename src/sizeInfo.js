import { minify } from 'terser'
import fileSize from 'filesize'
import { sync as syncBrotliSize } from 'brotli-size'
import gzip from 'gzip-size'
import { fluoVector } from '@palett/fluo-vector'
import { SUBTLE } from '@palett/presets'
import { zipper } from '@vect/vector'
import { DecoVector } from '@spare/logger'

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
  const info = { file: decoFileName(fileName) }
  const sizes = { bundle: fileSize(Buffer.byteLength(code), format) }
  if (p.showBrotli) Object.assign(sizes, { brotli: fileSize(syncBrotliSize(code), format) })
  if (p.showMinified) Object.assign(sizes, { min: fileSize(minifiedCode.length, format) })
  if (p.showGzipped) Object.assign(sizes, { gzip: fileSize(gzip.sync(minifiedCode), format) })
  info[decoNames(Object.keys(sizes))] = decoValues(Object.values(sizes), p.preset)
  return p.render ? p.render(info) : info
}

const KBREG = /\s+KB/gi

export const decoFileName = filename => {
  const parts = filename.split('.')
  const colorants = fluoVector(parts, { stringPreset: SUBTLE, colorant: true })
  return zipper(parts, colorants, (v, d) => d(v)).join('.')
}

export const decoNames = DecoVector({ indexed: false, delim: '/' })

export const decoValues = (values, preset) => {
  const colorants = fluoVector(values.map(x => +x.replace(KBREG, '')), { preset, colorant: true })
  return zipper(values, colorants, (v, d) => d(v))
}
