/**
 * 静态文件服务器
 */
const express = require('express')
const chalk = require('chalk')
const config = require('../config')
const choosePort = require('../utils/choosePort')
const logger = require('../utils/logger')

const app = express()

module.exports = async function() {
  app.use(express.static(config.outputPath))

  await new Promise(async (resolve, reject) => {
    const availablePortAndHost = await choosePort()
    if (availablePortAndHost === null)
      reject(
        new Error(`${chalk.bgRed('[Dev Server]')}: Setup failed. Port in used`)
      )
    const { port, host, prettyHost } = availablePortAndHost

    app.listen(port, host, err => {
      if (err) {
        logger.error(err)
        reject()
      }

      console.info(
        `[${chalk.green('Server')}]: serving ${chalk.blue(config.outputPath)}`
      )
      logger.appStarted(port, prettyHost)
      resolve()
    })
  })
}
