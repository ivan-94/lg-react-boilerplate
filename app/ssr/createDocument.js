/**
 * create html document
 */
import path from 'path'
import fs from 'fs'
import cheerio from 'cheerio'
import config from '../../internals/config'

const indexHtml = fs.readFileSync(path.join(config.outputPath, 'index.html'))

function replaceWithHelmet ($, helmet, tag) {
  const ele = $(tag)
  const helmetEle = helmet[tag].toString()
  if (ele.length && helmetEle !== '') {
    ele.replaceWith(helmetEle)
  } else {
    $('head').append(helmetEle)
  }
}

function handleHelmet ($, helmet) {
  let head = $('head')
  if (!head.length) {
    $('html').prepend('<head></head>')
    head = $('head')
  }
  // base
  replaceWithHelmet($, helmet, 'base')
  // title
  replaceWithHelmet($, helmet, 'title')

  ;['link', 'meta', 'noscript', 'script', 'style'].forEach(tag => {
    head.append(helmet[tag].toString())
  })
}

export default function createDocument ({ helmet, head, before, renderedString, after }) {
  const $ = cheerio.load(indexHtml)
  handleHelmet($, helmet)

  $('head')
  .append(head.join(' '))

  $('#app')
  .before(before.join(' '))
  .html(renderedString)
  .after(after.join(' '))
  return $.html()
}
