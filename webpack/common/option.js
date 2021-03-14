const path = require('path')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const preactConfig = require('./preact')

const ROOT = path.resolve(__dirname, '..', '..')
const SOURCE = path.resolve(ROOT, 'src', 'option')

module.exports = merge(preactConfig, {
  entry: {
    background: path.resolve(SOURCE, 'index.js')
  }
})