/* eslint consistent-return:0 */

const express = require('express')
const logger = require('../utils/logger')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const path = require('path')
const pkg = require(path.resolve(process.cwd(), 'package.json'))
const run = require('./run')
const clean = require('./clean')

const argv = require('minimist')(process.argv.slice(2))
const setup = require('../middlewares/frontend')
const setupProxy = require('../middlewares/proxy')
const webpackConfig = require('../webpack/webpack.dev.babel')
const isDev = process.env.NODE_ENV !== 'production'
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
  ? require('ngrok')
  : false
const app = express()

module.exports = async function start() {
  await run(clean)
  return new Promise(resolve => {
    function beforeHtml5Fallback() {
      // setup proxy
      if (pkg.proxy) {
        setupProxy(app, pkg.proxy)
      }
    }

    // setup webpack dev middleware
    if (isDev) {
      const compiler = webpack(webpackConfig)
      const wpDevMiddleware = webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: false,
        silent: true,
        stats: webpackConfig.stats,
      })
      const wpHotMiddleware = webpackHotMiddleware(compiler)
      setup(app, {
        wpHotMiddleware,
        wpDevMiddleware,
        webpackConfig,
        html5Fallback: true,
        beforeHtml5Fallback,
      })
    } else {
      setup(app, {
        webpackConfig,
        html5Fallback: true,
        beforeHtml5Fallback,
      })
    }

    // get the intended host and port number, use localhost and port 3000 if not provided
    const customHost = argv.host || process.env.HOST
    const host = customHost || null // Let http.Server use its default IPv6/4 host
    const prettyHost = customHost || 'localhost'

    const port = argv.port || process.env.PORT || 3000

    // Start your app.
    app.listen(port, host, err => {
      if (err) {
        logger.error(err.message)
        throw err
      }

      // Connect to ngrok in dev mode
      if (ngrok) {
        ngrok.connect(port, (innerErr, url) => {
          if (innerErr) {
            return logger.error(innerErr)
          }

          logger.appStarted(port, prettyHost, url)
        })
      } else {
        logger.appStarted(port, prettyHost)
      }
      resolve()
    })
  })
}
