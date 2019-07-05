const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const webpack = require('webpack');

module.exports = {
    entry: {
        backend: './src/backend/index.js',
    },
    output : {
        path : path.join(__dirname, '../public/dist'),
        filename : '[name].js',
        publicPath : '/dist/'
    },
    module : {
        rules : [
            {
                use : 'babel-loader',
                test : /\.js$/,
                exclude : '/node_modules'
            },
            {
                use : ['style-loader','css-loader'],
                test : /\.css$/
            },
            {
                use : 'file-loader',
                test : /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$|\.ico$/
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    },
    plugins : [
        new HtmlWebpackPlugin({
            filename : 'backend.html',
            template : './src/backend/index.html',
            chunks: ['backend']
        }),
        new webpack.ProvidePlugin({
            '$' : 'jquery',
            'jQuery' : 'jquery',
            'window.jQuery' : 'jquery',
            'window.$' : 'jquery'
        }),
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'jquery',
                    entry: {
                        path: 'dist/jquery.min.js',
                        type: 'js'
                    },
                    global: 'jQuery',
                },                
            ]
        }),
    ]
}