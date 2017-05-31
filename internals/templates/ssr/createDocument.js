/**
 * create html document
 */
import path from 'path'
import fs from 'fs'
import cheerio from 'cheerio'
import config from '../../internals/config'

const indexHtml = fs.readFileSync(path.join(config.outputPath, 'index.html'))

export default function createDocument (renderedString, store) {
  const $ = cheerio.load(indexHtml)
  $('#app')
  .html(renderedString)
  .after(
    `<script type="text/javascript">window.__INIT_STATE__ = ${JSON.stringify(store.getState())}</script>`
  )
  return $.html()
}
