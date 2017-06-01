import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { ThemeProvider, ServerStyleSheet } from 'styled-components'
import { RouterContext } from 'react-router'
import sprite from 'svg-sprite-loader/runtime/sprite.build'
import LanguageProvider from 'containers/LanguageProvider';
import createDocument from './createDocument'
import { translationMessages } from '../i18n';
import theme from '../theme'
import saga from '../saga'

export default function render (store, renderProps) {
  // collect styled-components styles
  const sheet = new ServerStyleSheet()
  const spriteContent = sprite.stringify()
  store.runSaga(saga)
  const Component = (
    <Provider store={store}>
      <LanguageProvider messages={translationMessages}>
        <ThemeProvider theme={theme}>
          <RouterContext {...renderProps} />
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  )

  const renderedString = renderToString(sheet.collectStyles(Component))
  const css = sheet.getStyleTags()

  return createDocument(
    // head
    [
      css,
    ],
    // before
    [
      spriteContent,
    ],
    renderedString,
    // after
    [
      `<script type="text/javascript">window.__INIT_STATE__ = ${JSON.stringify(store.getState())}</script>`,
    ]
  )
}
