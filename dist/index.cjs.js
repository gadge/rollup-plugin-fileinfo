'use strict';

var presets = require('@palett/presets');
var decoObject = require('@spare/deco-object');
var enumChars = require('@spare/enum-chars');
var timestampPretty = require('@valjoux/timestamp-pretty');
var enumColorantModes = require('@palett/enum-colorant-modes');
var fluoVector = require('@palett/fluo-vector');
var decoString = require('@spare/deco-string');
var decoVector = require('@spare/deco-vector');
var vectorZipper = require('@vect/vector-zipper');
var brotliSize = require('brotli-size');
var fileSize = require('filesize');
var gzip = require('gzip-size');
var terser = require('terser');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fileSize__default = /*#__PURE__*/_interopDefaultLegacy(fileSize);
var gzip__default = /*#__PURE__*/_interopDefaultLegacy(gzip);
var terser__default = /*#__PURE__*/_interopDefaultLegacy(terser);

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
const sizeInfo = async function (bundle, p) {
  const { code, fileName } = bundle, { format } = p;
  const minifiedCode = (await terser__default['default'].minify(code))?.code ?? '';
  const info = {};
  const sizes = { bundle: fileSize__default['default'](Buffer.byteLength(code), format) };
  if (p.showBrotli) Object.assign(sizes, { brotli: fileSize__default['default'](brotliSize.sync(code), format) });
  if (p.showMinified) Object.assign(sizes, { min: fileSize__default['default'](minifiedCode.length, format) });
  if (p.showGzipped) Object.assign(sizes, { gzip: fileSize__default['default'](gzip__default['default'].sync(minifiedCode), format) });
  info['file'] = decoFileName(fileName);
  info[decoNames(Object.keys(sizes))] = decoSizeValues(Object.values(sizes), p.preset);
  return p.render ? p.render(info) : info
};

const KB = /\s+KB/gi;

/** @type {Function} */const decoFileName = decoString.Deco({ presets: [presets.SUBTLE, presets.METRO] });

const decoNames = decoVector.Deco({ indexed: false, delim: '/', presets: [presets.SUBTLE, presets.LAVA] });

const decoSizeValues = (values, preset) => {
  const colorants = fluoVector.fluoVector.call(enumColorantModes.COLORANT, values.map(x => +x.replace(KB, '')), [preset]);
  return vectorZipper.zipper(values, colorants, (v, d) => d(v))
};

const decoSizeInfoObject = decoObject.Deco({ delim: enumChars.COSP, bracket: true });

const fileInfo = (config = {}) => {
  const defaultConfig = {
    format: {},
    preset: presets.METRO,
    render: o => `${timestampPretty.dateTime()} ${decoSizeInfoObject(o)}`,
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
        .forEach(async subBundle => console.log(await sizeInfo(subBundle, config))); // console.log(miscInfo(subBundle))
    }
  }
};

module.exports = fileInfo;
