'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var presets = require('@palett/presets');
var logger = require('@spare/logger');
var enumChars = require('@spare/enum-chars');
var terser = require('terser');
var fileSize = _interopDefault(require('filesize'));
var brotliSize = require('brotli-size');
var gzip = _interopDefault(require('gzip-size'));
var fluoVector = require('@palett/fluo-vector');
var vector = require('@vect/vector');

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
  const info = { file: decoFileName(fileName) };
  const sizes = { bundle: fileSize(Buffer.byteLength(code), format) };
  if (p.showBrotli) Object.assign(sizes, { brotli: fileSize(brotliSize.sync(code), format) });
  if (p.showMinified) Object.assign(sizes, { min: fileSize(minifiedCode.length, format) });
  if (p.showGzipped) Object.assign(sizes, { gzip: fileSize(gzip.sync(minifiedCode), format) });
  info[decoNames(Object.keys(sizes))] = decoValues(Object.values(sizes), p.preset);
  return p.render ? p.render(info) : info
};

const KBREG = /\s+KB/gi;

const decoFileName = filename => {
  const parts = filename.split('.');
  const colorants = fluoVector.fluoVector(parts, { stringPreset: presets.SUBTLE, colorant: true });
  return vector.zipper(parts, colorants, (v, d) => d(v)).join('.')
};

const decoNames = logger.DecoVector({ indexed: false, delim: '/' });

const decoValues = (values, preset) => {
  const colorants = fluoVector.fluoVector(values.map(x => +x.replace(KBREG, '')), { preset, colorant: true });
  return vector.zipper(values, colorants, (v, d) => d(v))
};

const bundlesize = (config = {}) => {
  const defaultConfig = {
    format: {},
    preset: presets.METRO,
    render: logger.DecoObject({ delim: enumChars.COSP, bracket: true }),
    showGzipped: true,
    showBrotli: false,
    showMinified: true
  };
  config = Object.assign(defaultConfig, config);
  return {
    name: 'bundlesize',
    generateBundle (options, bundle, isWrite) {
      Object
        .values(bundle)
        .filter(({ type }) => type !== 'asset')
        .forEach((subBundle) => {
          console.log(sizeInfo(subBundle, config));
        });
    }
  }
};

module.exports = bundlesize;
