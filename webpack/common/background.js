const path = require('path')

const ROOT = path.resolve(__dirname, '..', '..')
const SOURCE = path.resolve(ROOT, 'src', 'background')
const DEST = path.resolve(ROOT, 'dist', 'background')


module.exports = {
  entry: {
    background: path.resolve(SOURCE, 'index.js')
  },
  output: {
    filename: 'index.js',
    path: DEST,
    clean: true
  }
}