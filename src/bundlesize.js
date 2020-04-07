import { METRO } from '@palett/presets'
import { DecoObject } from '@spare/logger'
import { COSP } from '@spare/enum-chars'
import { sizeInfo } from './sizeInfo'

export const bundlesize = (config = {}) => {
  const defaultConfig = {
    format: {},
    preset: METRO,
    render: DecoObject({ delim: COSP, bracket: true }),
    showGzipped: true,
    showBrotli: false,
    showMinified: true
  }
  config = Object.assign(defaultConfig, config)
  return {
    name: 'bundlesize',
    generateBundle (options, bundle, isWrite) {
      Object
        .values(bundle)
        .filter(({ type }) => type !== 'asset')
        .forEach((subBundle) => {
          console.log(sizeInfo(subBundle, config))
        })
    }
  }
}
