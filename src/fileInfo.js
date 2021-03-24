import { METRO }    from '@palett/presets'
import { Deco }     from '@spare/deco-object'
import { COSP }     from '@spare/enum-chars'
import { dateTime } from '@valjoux/timestamp-pretty'
import { sizeInfo } from './sizeInfo'

const decoSizeInfoObject = Deco({ delim: COSP, bracket: true })

export const fileInfo = (config = {}) => {
  const defaultConfig = {
    format: {},
    preset: METRO,
    render: o => `${dateTime()} ${decoSizeInfoObject(o)}`,
    showGzipped: true,
    showBrotli: false,
    showMinified: true
  }
  config = Object.assign(defaultConfig, config)
  return {
    name: 'fileInfo',
    generateBundle(options, bundle, isWrite) {
      Object
        .values(bundle)
        .filter(({ type }) => type !== 'asset')
        .forEach(async subBundle => console.log(await sizeInfo(subBundle, config))) // console.log(miscInfo(subBundle))
    }
  }
}
