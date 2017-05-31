// server side bundle
const path = require('path')
const webpack = require('webpack')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = require('./webpack.base.babel')({
  name: 'Server',
  target: 'node',
  isSSR: true,
  entry: {
    server: path.join(process.cwd(), 'app/server.js'),
  },
  output: {
    filename: '../../server.js',
    libraryTarget: 'commonjs2',
  },
  babelQuery: {
    presets: [
      [
        'env',
        {
          targets: {
            node: 'current',
          },
          modules: false,
          // useBuiltIns: true,
        },
      ],
    ],
    plugins: ['dynamic-import-webpack'],
  },
  cssLoader: ['ignore-loader'],
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install()',
      raw: true,
      entryOnly: true,
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
  externals: [
    /^\.\/assets\.json/,
    (context, request, callback) => {
      let isExternal =
        request.match(/^[@a-z][a-z/.\-0-9]*$/i) &&
        !request.match(/\.(css|less|scss|sss)$/i);
      if (isExternal) {
        try {
          require.resolve(request)
          isExternal = true
        } catch (ignore) {
          isExternal = false
        }
      }
      callback(null, Boolean(isExternal))
    },
  ],
  definePlugin: [],
  node: {
    process: false,
    global: false,
    console: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
})
