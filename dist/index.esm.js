import { METRO, LAVA } from '@palett/presets';
import { Deco as Deco$2 } from '@spare/deco-object';
import { COSP } from '@spare/enum-chars';
import { dateTime } from '@valjoux/timestamp-pretty';
import { COLORANT } from '@palett/enum-colorant-modes';
import { fluoVector } from '@palett/fluo-vector';
import { Deco } from '@spare/deco-string';
import { Deco as Deco$1 } from '@spare/deco-vector';
import { zipper } from '@vect/vector-zipper';
import { sync } from 'brotli-size';
import fileSize from 'filesize';
import gzip from 'gzip-size';
import terser from 'terser';

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
const sizeInfo = function (bundle, p) {
  const { code, fileName } = bundle, { format } = p;
  const minifiedCode = terser.minify(code)?.code ?? '';
  const info = {};
  const sizes = { bundle: fileSize(Buffer.byteLength(code), format) };
  if (p.showBrotli) Object.assign(sizes, { brotli: fileSize(sync(code), format) });
  if (p.showMinified) Object.assign(sizes, { min: fileSize(minifiedCode.length, format) });
  if (p.showGzipped) Object.assign(sizes, { gzip: fileSize(gzip.sync(minifiedCode), format) });
  info['file'] = decoFileName(fileName);
  info[decoNames(Object.keys(sizes))] = decoSizeValues(Object.values(sizes), p.preset);

  return p.render ? p.render(info) : info
};

const KB = /\s+KB/gi;

/** @type {Function} */const decoFileName = Deco({ presets: METRO });

const decoNames = Deco$1({ indexed: false, delim: '/', presets: LAVA });

const decoSizeValues = (values, preset) => {
  const colorants = fluoVector.call(COLORANT, values.map(x => +x.replace(KB, '')), [preset]);
  return zipper(values, colorants, (v, d) => d(v))
};

const decoSizeInfoObject = Deco$2({ presets: 0, delim: COSP, bracket: true });

const fileInfo = (config = {}) => {
  const defaultConfig = {
    format: {},
    preset: METRO,
    render: o => `${ dateTime() } ${ decoSizeInfoObject(o) }`,
    showGzipped: true,
    showBrotli: false,
    showMinified: true
  };
  config = Object.assign(defaultConfig, config);
  return {
    name: 'fileInfo',
    generateBundle(options, bundle, isWrite) {
      Object
        .values(bundle)
        .filter(({ type }) => type !== 'asset')
        .forEach((subBundle) => {
          // console.log(miscInfo(subBundle))
          console.log(sizeInfo(subBundle, config));
        });
    }
  }
};

export { fileInfo };
