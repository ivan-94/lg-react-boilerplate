import 'babel-polyfill'
import path from 'path'
import morgan from 'morgan'
import chalk from 'chalk'
import express from 'express'
import compression from 'compression'
import LRU from 'lru-cache'
import warning from 'warning'
import minimist from 'minimist'
import { match, createMemoryHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { makeSelectLocationState } from 'containers/App/selectors'
import App from 'containers/App'
import configureStore from './store'
import createRoutes from './routes'
import render from './ssr/render'

const argv = minimist(process.argv.slice(2))

const port = argv.port || process.env.PORT || 3000
const customHost = argv.host || process.env.HOST
const host = customHost || null // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost'
const app = express()

// micro cache
const microCache = LRU({
  max: 100,
  maxAge: 1000,
})

// static cache
const staticCache = LRU()

// logger
app.use(morgan('combined'))

app.use(compression({ threshold: 0 }))

// static resources
app.use(express.static(path.join(__dirname, './public')))

app.use((req, res) => {
  const initialState = {}
  const memoryHistory = createMemoryHistory(req.url)
  const store = configureStore(initialState, memoryHistory)
  const history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState: makeSelectLocationState(),
  })

  const routes = {
    component: App,
    childRoutes: createRoutes(store),
  }

  match(
    { history, routes, location: req.url },
    async (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(
          302,
          `${redirectLocation.pathname}${redirectLocation.search}`
        )
      } else if (renderProps) {
        const matchedRoutes = renderProps.routes
        const leafRoute = matchedRoutes[matchedRoutes.length - 1]
        const notFound = matchedRoutes.some(route => route.path === '*')
        const cacheKey = leafRoute.name || leafRoute.path
        if (process.env.NODE_ENV === 'development') {
          warning(leafRoute.name != null, `route#name is required`)
        }

        // micro cache
        if (leafRoute.cacheable) {
          const hit = microCache.get(cacheKey)
          if (hit) {
            if (process.env.NODE_ENV === 'development') {
              console.log('cache hit!')
            }
            return res.status(notFound ? 404 : 200).send(hit)
          }
        }

        // static cache
        if (leafRoute.static) {
          const hit = staticCache.get(cacheKey)
          if (hit) {
            if (process.env.NODE_ENV === 'development') {
              console.log('static cache hit!')
            }
            return res.status(notFound ? 404 : 200).send(hit)
          }
        }

        const output = await render(store, renderProps)
        res.status(notFound ? 404 : 200).send(output)

        if (leafRoute.cacheable) {
          microCache.set(cacheKey, output)
        }

        if (leafRoute.static) {
          staticCache.set(cacheKey, output)
        }
      }
    }
  )
})

app.listen(port, host, err => {
  if (err) {
    console.log(`❌ ${chalk.red('[Server]')}: Fail to setup ssrServer.\n ${err}`)
    return
  }

  console.log(
    `✅ ${chalk.green('[Server]')}: ssrServer success on ${chalk.yellow(
      `http://${prettyHost}:${port}`
    )}.`
  )

  if (process.send) {
    // notify runner
    process.send({
      type: 'finished',
      payload: {
        target: `http://${prettyHost}:${port}`,
      },
    })
  }
})
