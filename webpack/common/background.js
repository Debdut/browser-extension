const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..')

module.exports = {
  entry: {
    background: path.resolve(ROOT, 'src', 'background', 'index.js')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(ROOT, 'dist')
  }
}