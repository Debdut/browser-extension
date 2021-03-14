const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..')

module.exports = {
  entry: {
    background: path.resolve(ROOT, 'src', 'background', 'index.js')
  },
  output: {
    filename: 'index.js',
    path: path.resolve(ROOT, 'dist', 'background')
  }
}