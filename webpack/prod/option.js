const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')

const common = require('../common/option')

const ROOT = path.resolve(__dirname, '..', '..')
const DEST = path.resolve(ROOT, 'dist')

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'option.js',
    path: DEST
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Popup',
      filename: 'option.html'
    }),
  ]
})