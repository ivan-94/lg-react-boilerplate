const rmdir = require('./helpers').rmdir

module.exports = function clean() {
  return Promise.all([
    rmdir('build/*', {
      nosort: true,
      dot: true,
      ignore: ['build/.git'],
    }),
  ])
}
