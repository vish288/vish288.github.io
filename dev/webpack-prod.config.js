const path = require('path')
const buildPath = path.resolve(__dirname, '..')
const nodeModulesPath = path.resolve(__dirname, 'node_modules')
const TransferWebpackPlugin = require('transfer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const config = {
  mode: 'production',
  entry: [path.join(__dirname, '/src/index.js')],
  resolve: {
    //When require, do not have to add these extensions to file's name
    extensions: ['*', '.js'],
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //Render source-map file for final build
  devtool: 'source-map',
  //output config
  output: {
    path: buildPath,    //Path of output file
    filename: 'app.js',  //Name of output file
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ],
  },
  plugins: [
    //Transfer Files
    new TransferWebpackPlugin([
      { from: 'www' },
    ], path.resolve(__dirname, 'src')),
  ],
  module: {
    rules: [
      {
        test: /\.js$/, // All .js files
        use: ['babel-loader'], //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath],
      },
    ],
  },
}

module.exports = config
