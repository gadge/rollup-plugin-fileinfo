import { METRO }      from '@palett/presets'
import { DecoObject } from '@spare/deco-object'
import { dateTime }   from '@valjoux/timestamp-pretty'
import { sizeInfo }   from './sizeInfo'

const decoSizeInfoObject = DecoObject({ thres: NaN })

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
