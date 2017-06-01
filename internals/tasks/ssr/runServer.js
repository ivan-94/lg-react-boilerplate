const path = require('path')
const cp = require('child_process')
const chalk = require('chalk')
const serverConfig = require('../../webpack/webpack.ssr.babel')

let server
let pending = true
const serverPath = path.join(serverConfig.output.path, serverConfig.output.filename)

module.exports = async function runServer () {
  return new Promise(resolve => {
    if (server) {
      console.log(
        `⌛️ ${chalk.blue('[Server Runner]')}: restarting server.`
      )
      server.kill()
    } else {
      console.log(
        `⌛️ ${chalk.blue('[Server Runner]')}: setuping server.`
      )
    }

    server = cp.fork(serverPath, [], {
      env: {
        ...process.env,
        NODE_ENV: 'development',
        PORT: 3001, // defaultPort in development
      },
    })


    server.on('message', message => {
      if (message.type === 'finished') {
        server.target = message.payload.target
        pending = false
        console.log(
          `✅ ${chalk.blue('[Server Runner]')}: Server setup on ${chalk.yellow(server.target)}.`
        )
        resolve(server)
      } else {
        console.log(
          `✉️ ${chalk.blue('[Server Runner]')}: received message from server: ${chalk.bgWhite.black(JSON.stringify(message))}.`
        )
      }
    })

    if (pending) {
      server.once('exit', (code, signal) => {
        if (pending) {
          throw new Error(`${chalk.red('[Server]')} terminated unexpectedly with code: ${code} & signal ${signal}`)
        }
      })
    }
  })
}

process.on('exit', () => {
  if (server) server.kill()
})
