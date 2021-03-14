const { merge } = require('webpack-merge')
const path = require('path')

const common = require('../common/background')

module.exports = merge(common, {
  mode: 'production'
})
