module.exports = function (api) {
  api.cache(true)
  const presets = [['@babel/preset-env', { targets: { node: '8' } }]]
  const plugins = []
  const ignore = ['node_modules/**']
  return {
    presets,
    plugins,
    ignore
  }
}
