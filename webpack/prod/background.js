const { merge } = require('webpack-merge')
const path = require('path')

const common = require('../common/background')

const ROOT = path.resolve(__dirname, '..', '..')
const DEST = path.resolve(ROOT, 'dist')

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'background.js',
    path: DEST
  }
})