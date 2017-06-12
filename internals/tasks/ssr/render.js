/**
 * prerender routes
 */
const path = require('path')
const chalk = require('chalk')
const fetch = require('isomorphic-fetch')
const writeFile = require('write')
const run = require('../run')
const runServer = require('./runServer')
const config = require('../../config')

module.exports = async function render() {
  const server = await runServer()
  const { target } = server
  const dist = config.outputPath
  const routes = config.prerenderRoutes
  if (!routes || routes.length === 0) return
  await Promise.all(
    routes.map(async (route, index) => {
      const url = `${target}${route}`
      const filename = route.endsWith('/')
        ? 'index.html'
        : `${path.basename(route, '.html')}.html`
      const dirname = route.endsWith('/') ? route : path.dirname(route)
      const fullPath = path.join(dist, dirname, filename)
      const timeStart = new Date()
      try {
        const response = await fetch(url)
        const text = await response.text()
        writeFile.sync(fullPath, text)
        const time = new Date().getTime() - timeStart.getTime()
        console.log(
          `[${chalk.green(
            'Renderer'
          )}]: render success ${url} -> ${fullPath} (${time} ms)`
        )
      } catch (e) {
        console.error(`[${chalk.red('Renderer')}]: render ${url} error`, err)
      }
    })
  )
  server.kill('SIGTERM')
}
