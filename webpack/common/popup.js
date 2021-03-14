const path = require('path')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const preactConfig = require('./preact')

const ROOT = path.resolve(__dirname, '..', '..')
const SOURCE = path.resolve(ROOT, 'src', 'popup')

module.exports = merge(preactConfig, {
  entry: {
    background: path.resolve(SOURCE, 'index.js')
  },
  output: {
    filename: 'index.[contenthash].js',
    path: path.resolve(ROOT, 'dist', 'popup'),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Popup',
      template: path.resolve(SOURCE, 'index.html')
    }),
  ]
})