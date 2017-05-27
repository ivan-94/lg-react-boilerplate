// server side bundle
const path = require('path')
const webpack = require('webpack')

module.exports = require('./webpack.base.babel')({
  name: 'Server',
  target: 'node',
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
  },
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
      const isExternal =
        request.match(/^[@a-z][a-z/.\-0-9]*$/i) &&
        !request.match(/\.(css|less|scss|sss)$/i);
      callback(null, Boolean(isExternal))
    },
  ],
  devtool: 'cheap-module-source-map',
})
