import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { RouterContext } from 'react-router'
import LanguageProvider from 'containers/LanguageProvider';
import createDocument from './createDocument'
import { translationMessages } from '../i18n';
import theme from '../theme'
import saga from '../saga'

export default function render (store, renderProps) {
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

  const renderedString = renderToString(Component)
  return createDocument(renderedString, store)
}
