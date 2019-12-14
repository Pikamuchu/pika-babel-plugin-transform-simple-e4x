var path = require('path')

module.exports = {
  target: 'web',
  entry: path.join(__dirname, 'lib/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'babel-plugin-transform-simple-e4x.min.js',
    library: 'babel-plugin-transform-simple-e4x',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\/xml?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
