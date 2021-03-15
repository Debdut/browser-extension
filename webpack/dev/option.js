const { merge } = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('../common/option')

const ROOT = path.resolve(__dirname, '..', '..')
const SOURCE = path.resolve(ROOT, 'src', 'option')
const DEST = path.resolve(ROOT, 'dist', 'option')

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: 'index.[contenthash].js',
    path: DEST,
    clean: true
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: DEST,
    hot: true,
    injectHot: true,
    compress: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Option',
      template: path.resolve(SOURCE, 'index.html')
    }),
  ]
})
