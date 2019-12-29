const webpack = require('webpack');

module.exports = (env = {}, argv) => {
  const isDevelopment = argv.mode === 'development'
  let config = {
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    output: {
      path: __dirname + '/dist',
      publicPath: '/',
      filename: 'bundle.js'
    }
  };

  if (isDevelopment) {
    config.output.path = __dirname + '/public',
    config.plugins = [new webpack.HotModuleReplacementPlugin]
    config.devServer = {
      contentBase: './public',
      hot: true
    };
  }

  return config;
};
