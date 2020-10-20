import { deco } from '@spare/logger'

export const miscInfo = function (bundle) {
  const o = Object.assign({}, bundle)
  delete o.code
  return deco(o)
}
