const chalk = require('chalk')
const detectPort = require('detect-port')
const argv = require('minimist')(process.argv.slice(2))
const inquirer = require('inquirer')

const defaultPort = argv.port || process.env.PORT || 3000
const customHost = argv.host || process.env.HOST
const host = customHost || null // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost'

module.exports = function choosePort() {
  return new Promise(resolve => {
    detectPort(defaultPort, (err, port) => {
      if (err) {
        console.log(`${chalk.bgRed.white('[choosePort]')} Error: ${err}`)
        throw err
      }
      if (port === defaultPort) {
        resolve({ port, host, prettyHost })
      } else {
        // port occupied
        const question = {
          type: 'confirm',
          name: 'shouldChangePort',
          message: `${chalk.yellow(
            '[choosePort]'
          )}: defaultPort(${defaultPort}) is already in used.
  Would you like to run server on another post instead?`,
          default: true,
        }

        inquirer.prompt([question]).then(answer => {
          if (answer.shouldChangePort) resolve({ port, host, prettyHost })
          else resolve(null)
        })
      }
    })
  })
}
