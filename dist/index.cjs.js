'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var presets = require('@palett/presets');
var decoObject = require('@spare/deco-object');
var enumChars = require('@spare/enum-chars');
var fileSize = _interopDefault(require('filesize'));
var gzip = _interopDefault(require('gzip-size'));
var terser = require('terser');
var brotliSize = require('brotli-size');
var fluoVector = require('@palett/fluo-vector');
var vectorZipper = require('@vect/vector-zipper');
var decoVector = require('@spare/deco-vector');
var decoString = require('@spare/deco-string');

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
  const minifiedCode = terser.minify(code).code;
  const info = { file: decoString.decoPhrase(fileName, { delim: '.', stringPreset: presets.SUBTLE }) };
  const sizes = { bundle: fileSize(Buffer.byteLength(code), format) };
  if (p.showBrotli) Object.assign(sizes, { brotli: fileSize(brotliSize.sync(code), format) });
  if (p.showMinified) Object.assign(sizes, { min: fileSize(minifiedCode.length, format) });
  if (p.showGzipped) Object.assign(sizes, { gzip: fileSize(gzip.sync(minifiedCode), format) });
  info[decoNames(Object.keys(sizes))] = decoValues(Object.values(sizes), p.preset);
  return p.render ? p.render(info) : info
};

const KBREG = /\s+KB/gi;

const decoNames = decoVector.Deco({ indexed: false, delim: '/' });

const decoValues = (values, preset) => {
  const colorants = fluoVector.fluoVector(values.map(x => +x.replace(KBREG, '')), { preset, colorant: true });
  return vectorZipper.zipper(values, colorants, (v, d) => d(v))
};

const fileInfo = (config = {}) => {
  const defaultConfig = {
    format: {},
    preset: presets.METRO,
    render: decoObject.Deco({ delim: enumChars.COSP, bracket: true }),
    showGzipped: true,
    showBrotli: false,
    showMinified: true
  };
  config = Object.assign(defaultConfig, config);
  return {
    name: 'fileInfo',
    generateBundle (options, bundle, isWrite) {
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

module.exports = fileInfo;
