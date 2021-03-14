const { merge } = require('webpack-merge')
const path = require('path')

const common = require('../common/popup')

const ROOT = path.resolve(__dirname, '..', '..')
const DEST = path.resolve(ROOT, 'dist', 'popup')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: DEST
  }
})
