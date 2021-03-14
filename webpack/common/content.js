const path = require('path')
const { merge } = require('webpack-merge')

const preactConfig = require('./preact')

const ROOT = path.resolve(__dirname, '..', '..')
const SOURCE = path.resolve(ROOT, 'src', 'content')

module.exports = merge(preactConfig, {
  entry: {
    background: path.resolve(SOURCE, 'index.js')
  },
  output: {
    filename: 'index.[contenthash].js',
    path: path.resolve(ROOT, 'dist', 'content'),
    clean: true
  }
})