const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: [
    './src',
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      }],
  },
  optimization: {
    occurrenceOrder: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
  },
}
