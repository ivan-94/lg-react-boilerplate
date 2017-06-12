/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill'

// Import all the third party stuff
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyRouterMiddleware, Router, match } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { useScroll } from 'react-router-scroll'
import { ThemeProvider } from 'styled-components'
import 'sanitize.css/sanitize.css'

// Import root app
import App from 'containers/App'

// Import selector for `syncHistoryWithStore`
import { makeSelectLocationState } from 'containers/App/selectors'

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider'

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./favicon.ico'
import '!file-loader?name=[name].[ext]!./manifest.json'
import 'file-loader?name=[name].[ext]!./.htaccess'
/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from './store'

// Import i18n messages
import { translationMessages } from './i18n'

// Import CSS reset and Global Styles
import './global-styles'
import theme from './theme'

// Import root saga
import saga from './saga'
// Import root routes
import createRoutes from './routes'
// Import Router history, 可以灵活地调整history类型
import browserHistory from './history'

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = window.__INIT_STATE__ || {}
const store = configureStore(initialState, browserHistory)
store.runSaga(saga)

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: makeSelectLocationState(),
})

// Set up the router, wrapping all Routes in the App component
const routes = {
  component: App,
  childRoutes: createRoutes(store),
}

const render = messages => {
  match(
    { history: browserHistory, routes },
    (error, redirectLocation, renderProps) => {
      ReactDOM.render(
        <Provider store={store}>
          <LanguageProvider messages={messages}>
            <ThemeProvider theme={theme}>
              <Router
                routes={routes}
                history={history}
                matchContext={renderProps.matchContext}
                render={// Scroll to top when going to a new page, imitating default browser
                // behaviour
                applyRouterMiddleware(useScroll())}
              />
            </ThemeProvider>
          </LanguageProvider>
        </Provider>,
        document.getElementById('app')
      )
    }
  )
}

// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./i18n', () => {
    render(translationMessages)
  })
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'))
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err
    })
} else {
  render(translationMessages)
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
// if (process.env.NODE_ENV === 'production') {
//   require('offline-plugin/runtime').install() // eslint-disable-line global-require
// }
