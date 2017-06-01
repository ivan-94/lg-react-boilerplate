const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const express = require('express')
const setupProxy = require('../../middlewares/proxy')
const setupFrontEndMiddleware = require('../../middlewares/frontend')
const clientConfig = require('../../webpack/webpack.dev.babel')
const serverConfig = require('../../webpack/webpack.ssr.babel')
const logger = require('../../utils/logger');
const choosePort = require('../../utils/choosePort')
const pkg = require(path.resolve(process.cwd(), 'package.json'))
const run = require('../run')
const clean = require('../clean')
const runServer = require('./runServer')

const webpackConfig = [clientConfig, serverConfig]
const app = express()
const staticHtmlPath = path.join(clientConfig.output.path, 'index.html')

module.exports = async function start () {
  await run(clean)
  await new Promise(resolve => {
    // 输出到文件系统，这样才可以被执行
    serverConfig.plugins.push(new WriteFileWebpackPlugin({ log: false }))

    const compiler = webpack(webpackConfig)
    const wpDevMiddleware = webpackDevMiddleware(compiler, {
      publicPath: clientConfig.output.publicPath,
      noInfo: false,
      silent: true,
      stats: clientConfig.stats,
    })
    // 客户端才启用热重载
    const wpHotMiddleware = webpackHotMiddleware(compiler.compilers[0])
    // 每次编译完成都会调用
    let handleCompileDone = async () => {
      // 重启服务器
      handleCompileDone = stats => !stats.stats[1].compilation.errors.length && runServer()
      // 运行服务器
      const server = await runServer()
      // frontendMiddleware
      setupFrontEndMiddleware(app, {
        wpDevMiddleware,
        wpHotMiddleware,
        webpackConfig: clientConfig,
        html5Fallback: false, // ssr
      })
      // API proxy
      if (pkg.proxy) {
        setupProxy(app, pkg.proxy)
      }
      // Server Porxy
      setupProxy(app, {
        options: {
          target: server.target,
          fallback (err, req, res) {
            res.sendFile(staticHtmlPath)
          },
        },
      })

      const availablePortAndHost = await choosePort()
      if (availablePortAndHost === null) throw new Error(`${chalk.bgRed('[Dev Server]')}: Setup failed. Port in used`)
      const { port, host, prettyHost } = availablePortAndHost

      // finished
      app.listen(port, host, err => {
        if (err) {
          logger.error(err)
          throw err
        }
        logger.appStarted(port, prettyHost);
        resolve()
      })
    }
    compiler.plugin('done', stats => handleCompileDone(stats))
  })
}
