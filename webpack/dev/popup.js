const { merge } = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('../common/popup')

const ROOT = path.resolve(__dirname, '..', '..')
const SOURCE = path.resolve(ROOT, 'src', 'popup')
const DEST = path.resolve(ROOT, 'dist', 'popup')

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'index.[contenthash].js',
    path: DEST,
    clean: true
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: DEST
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Popup',
      template: path.resolve(SOURCE, 'index.html')
    }),
  ]
})
