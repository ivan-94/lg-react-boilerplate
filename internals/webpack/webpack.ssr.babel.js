// server side bundle
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const determineFile = require('./helpers').determineFile

module.exports = require('./webpack.base.babel')({
  target: 'node',
  entry: {
    server: path.join(process.cwd(), 'app/server.js'),
  },
  output: {
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: './app/assets/images/favicons.png',
      inject: true,
      title: '朗捷科技',
      icons: {
        favicons: true,
        appleIcon: true,
        appleStartup: false,
        android: false,
        twitter: false,
        yandex: false,
        windows: false,
        coast: false,
        firefox: false,
      },
    }),

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: determineFile('app/index', '.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
  ],
})
