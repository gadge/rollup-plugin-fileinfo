import { AZALE, LAVA, PAGODA, SUBTLE } from '@palett/presets'
import { DecoString }                  from '@spare/deco-string'
import { DecoVector }                  from '@spare/deco-vector'
import { sync as syncBrotliSize }      from 'brotli-size'
import fileSize                        from 'filesize'
import { gzipSizeSync }                from 'gzip-size'
import { minify }                      from 'terser'

/** @type {function} */
export const decoFileName = DecoString({ thres: NaN, pres: { str: SUBTLE, num: PAGODA } })
/** @type {function} */
export const decoNames = DecoVector({ thres: NaN, delim: '/', pres: { str: SUBTLE, num: LAVA } })
/** @type {function} */
export const decoSizes = DecoVector({ thres: NaN, delim: '/', pres: { str: AZALE, num: PAGODA } })

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
export const sizeInfo = async function (bundle, p) {
  const { code, fileName } = bundle, { format } = p
  const minifiedCode = (await minify(code))?.code ?? ''
  const info = {}
  const sizes = { bundle: fileSize(Buffer.byteLength(code), format) }
  if (p.showBrotli) Object.assign(sizes, { brotli: fileSize(syncBrotliSize(code), format) })
  if (p.showMinified) Object.assign(sizes, { min: fileSize(minifiedCode.length, format) })
  if (p.showGzipped) Object.assign(sizes, { gzip: fileSize(gzipSizeSync(minifiedCode), format) })
  info['file'] = decoFileName(fileName)
  info[decoNames(Object.keys(sizes))] = decoSizes(Object.values(sizes), { pres: p.preset })
  return p.render ? p.render(info) : info
}