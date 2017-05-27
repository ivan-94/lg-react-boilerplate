/**
 * 运行器
 */
const chalk = require('chalk')

function formatTime (time) {
  return time.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

function run (fn, options) {
  const task = typeof fn.default === 'undefined' ? fn : fn.default
  const start = new Date()
  console.log(
    `[${chalk.green(formatTime(start))}] Starting: ${task.name} ${options || ''}`
  )

  return task(options)
  .then(resolution => {
    const end = new Date()
    const time = end.getTime() - start.getTime()
    console.log(
      `[${chalk.green(formatTime(end))}] Finished: ${task.name} ${options || ''} -- ${time}ms`
    )
    return resolution
  })
}

// 被node程序直接调用
if (require.main === module && process.argv.length > 2) {
  // 删除模块缓存，避免模块循环, 因为require的代码可能会导入当前文件
  delete require.cache[__filename]
  const module = require(`./${process.argv[2]}.js`) // eslint-disable-line global-require
  run(module)
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
}

module.exports = run
