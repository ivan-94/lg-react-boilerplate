const rimraf = require('rimraf')

exports.rmdir = function rmdir(pattern, options) {
  return new Promise((res, rej) => {
    rimraf(pattern, { glob: options }, (err, result) => {
      if (err) rej(err)
      res(result)
    })
  })
}
