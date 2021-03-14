const { merge } = require('webpack-merge')
const path = require('path')

const common = require('../common/background')

const ROOT = path.resolve(__dirname, '..', '..')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(ROOT, 'dist', 'background')
  }
})
