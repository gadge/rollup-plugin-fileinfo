import { METRO } from '@palett/presets'
import { Deco } from '@spare/deco-object'
import { COSP } from '@spare/enum-chars'
import { sizeInfo } from './sizeInfo'

export const fileInfo = (config = {}) => {
  const defaultConfig = {
    format: {},
    preset: METRO,
    render: Deco({ delim: COSP, bracket: true }),
    showGzipped: true,
    showBrotli: false,
    showMinified: true
  }
  config = Object.assign(defaultConfig, config)
  return {
    name: 'fileInfo',
    generateBundle (options, bundle, isWrite) {
      Object
        .values(bundle)
        .filter(({ type }) => type !== 'asset')
        .forEach((subBundle) => {
          // console.log(miscInfo(subBundle))
          console.log(sizeInfo(subBundle, config))
        })
    }
  }
}
