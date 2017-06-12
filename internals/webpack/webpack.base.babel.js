/**
 * COMMON WEBPACK CONFIGURATION
 */

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const determineExtensions = require('./helpers').determineExtensions
const config = require('../config')

module.exports = options => ({
  name: options.name || 'Client',
  entry: options.entry,
  output: Object.assign(
    {
      // Compile into js/build.js
      path: config.outputPath,
      publicPath: '/assets/',
    },
    options.output
  ), // Merge with env dependent settings
  module: {
    loaders: [
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: options.babelQuery,
      },
      {
        // Do not transform vendor's CSS with CSS-modules
        // The point is that they remain in global scope.
        // Since we require these CSS files in our JS or CSS files,
        // they will be a part of our compilation either way.
        // So, no need for ExtractTextPlugin here.
        test: /\.css$/,
        include: /node_modules/,
        use:
          options.cssLoader ||
            ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: 'css-loader',
            }),
      },
      {
        test: /\.svg$/,
        use: [{ loader: 'svg-sprite-loader' }, 'svgo-loader'],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        query: {
          emitFile: !options.isSSR,
        },
      },
      {
        test: /\.(jpg|png|gif)$/,
        loaders: options.isSSR
          ? [
              {
                loader: 'file-loader',
                query: {
                  emitFile: false,
                },
              },
            ]
          : [
              'file-loader',
              {
                loader: 'image-webpack-loader',
                query: {
                  progressive: true,
                  optimizationLevel: 7,
                  interlaced: false,
                  pngquant: {
                    quality: '65-90',
                    speed: 4,
                  },
                },
              },
            ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          emitFile: !options.isSSR,
        },
      },
    ],
  },
  plugins: options.plugins
    .concat([
      new ExtractTextPlugin('style.css'),
      new webpack.ProvidePlugin({
        // make fetch available
        fetch: 'exports-loader?self.fetch!whatwg-fetch',
      }),
      new webpack.NamedModulesPlugin(),
    ])
    .concat(
      options.definePlugin || [
        // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
        // inside your code for any environment checks; UglifyJS will automatically
        // drop any unreachable code.
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            ISOMORPHIC: JSON.stringify(process.env.ISOMORPHIC),
          },
        }),
      ]
    ),
  resolve: {
    // 使得可以直接导入app目录下的模块
    modules: ['app', 'node_modules'],
    extensions: determineExtensions().concat([
      '.web.js', // antd-mobile
      '.js',
      '.jsx',
      '.react.js',
      '.json',
    ]),
    mainFields: ['browser', 'jsnext:main', 'main'],
  },
  externals: options.externals,
  devtool: options.devtool,
  target: options.target || 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  node: options.node,
  stats: Object.assign({
    colors: true,
    timings: true,
    hash: false,
    version: false,
    chunks: true,
    chunkModules: false,
    cached: false,
    cachedAssets: false,
  }),
})
