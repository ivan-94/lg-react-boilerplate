#!/usr/bin/env node

const shell = require('shelljs')
const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')
const animateProgress = require('./helpers/progress')
const addCheckMark = require('./helpers/checkmark')
const readline = require('readline')

process.stdin.resume()
process.stdin.setEncoding('utf8')

process.stdout.write('\n')
let interval = animateProgress('正在清理旧版本库')
process.stdout.write('正在清理旧版本库')

cleanRepo(() => {
  clearInterval(interval)
  process.stdout.write('\n正在安装依赖... (可能会花一些时间)')
  setTimeout(() => {
    readline.cursorTo(process.stdout, 0)
    interval = animateProgress('正在安装依赖')
  }, 500)

  installDeps()
})

/**
 * Deletes the .git folder in dir
 */
function cleanRepo(callback) {
  shell.rm('-rf', '.git/')
  addCheckMark(callback)
}

/**
 * Initializes git again
 */
function initGit(callback) {
  exec(
    'git init && git add . && git commit -m "Initial commit"',
    addCheckMark.bind(null, callback)
  )
}

/**
 * Deletes a file in the current directory
 */
function deleteFileInCurrentDir(file, callback) {
  fs.unlink(path.join(__dirname, file), callback)
}

/**
 * Installs dependencies
 */
function installDeps() {
  exec('node --version', (err, stdout, stderr) => {
    const nodeVersion = stdout && parseFloat(stdout.substring(1))
    if (nodeVersion < 5 || err) {
      installDepsCallback(err || '不支持当前的 node.js 版本, 确保安装最新的稳定版本.')
    } else {
      exec('yarn --version', (err, stdout, stderr) => {
        if (
          parseFloat(stdout) < 0.15 ||
          err ||
          process.env.USE_YARN === 'false'
        ) {
          exec('npm install', addCheckMark.bind(null, installDepsCallback))
        } else {
          exec('yarn install', addCheckMark.bind(null, installDepsCallback))
        }
      })
    }
  })
}

/**
 * Callback function after installing dependencies
 */
function installDepsCallback(error) {
  clearInterval(interval)
  process.stdout.write('\n\n')
  if (error) {
    process.stderr.write(error)
    process.stdout.write('\n')
    process.exit(1)
  }

  deleteFileInCurrentDir('setup.js', () => {
    interval = animateProgress('正在安装新版本库')
    process.stdout.write('正在安装新版本库')
    initGit(() => {
      clearInterval(interval)
      process.stdout.write('\n完成!')
      process.exit(0)
    })
  })
}
