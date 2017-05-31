/**
 * create html document
 */
import path from 'path'
import fs from 'fs'
import cheerio from 'cheerio'
import config from '../../internals/config'

const indexHtml = fs.readFileSync(path.join(config.outputPath, 'index.html'))

export default function createDocument (before, renderedString, after) {
  const $ = cheerio.load(indexHtml)
  $('#app')
  .before(before.join(' '))
  .html(renderedString)
  .after(after.join(' '))
  return $.html()
}
