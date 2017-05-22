const fs = require('fs')
const config = require('../config')
const platformToExtension = config.platformToExtension
const platform = process.env.PLATFORM
const exts = platformToExtension[platform]

exports.isMobile = function isMobile () {
  return process.env.PLATFORM === 'mobile'
}

exports.determineExtensions = function determineExtensions () {
  if (exts) {
    if (Array.isArray(exts)) {
      return exts.map(ext => `.${ext}.js`)
    }
    return [`.${exts}.js`]
  }
  return []
}

exports.determineFile = function determineFile (name, ext = '.js', checkExists = true) {
  if (exts) {
    if (Array.isArray(exts)) {
      for (const item of exts) { // eslint-disable-line no-restricted-syntax
        const fileName = `${name}.${item}${ext}`
        if (checkExists && fs.existsSync(fileName)) {
          return fileName
        }
      }
    }

    const fileName = `${name}.${exts}${ext}`
    if (!fs.existsSync(fileName)) {
      console.error(`determineFile: ${fileName} not existed!`) // eslint-disable-line
    }
    return fileName
  }

  return `${name}${ext}`
}
