const webpack = require("webpack");

module.exports = {
    entry: [
        './src'
    ],
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'app.js'
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            loader: 'babel'
        }]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './'
    },
    noInfo: true
};
