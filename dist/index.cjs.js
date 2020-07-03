'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

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
var fileSize = _interopDefault(require('filesize'));
var gzip = _interopDefault(require('gzip-size'));
var terser = require('terser');

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
  const info = {};
  const sizes = { bundle: fileSize(Buffer.byteLength(code), format) };
  if (p.showBrotli) Object.assign(sizes, { brotli: fileSize(brotliSize.sync(code), format) });
  if (p.showMinified) Object.assign(sizes, { min: fileSize(minifiedCode.length, format) });
  if (p.showGzipped) Object.assign(sizes, { gzip: fileSize(gzip.sync(minifiedCode), format) });

  info['file'] = decoFileName(fileName);
  info[decoNames(Object.keys(sizes))] = decoSizeValues(Object.values(sizes), p.preset);

  return p.render ? p.render(info) : info
};

const KB = /\s+KB/gi;

/** @type {Function} */const decoFileName = decoString.Deco({ presets: [undefined, { preset: presets.METRO }] });

const decoNames = decoVector.Deco({ indexed: false, delim: '/', presets: [undefined, { preset: presets.LAVA }] });

const decoSizeValues = (values, preset) => {
  const colorants = fluoVector.fluoVec.call(enumColorantModes.COLORANT, values.map(x => +x.replace(KB, '')), [undefined, { preset }]);
  return vectorZipper.zipper(values, colorants, (v, d) => d(v))
};

const decoSizeInfoObject = decoObject.Deco({ presets: 0, delim: enumChars.COSP, bracket: true });

let index = 0;

const fileInfo = (config = {}) => {
  const defaultConfig = {
    format: {},
    preset: presets.METRO,
    render: o => `[${ ++index }] ${ timestampPretty.dateTime() } ${ decoSizeInfoObject(o) }`,
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

module.exports = fileInfo;
