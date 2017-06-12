/**
 * NotFoundPage
 * @flow
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const Code = styled.h2`
  color: gray;
  font-size: 2em;
`

export default class NotFound extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  shouldOmitChildren = true
  render() {
    return (
      <div>
        <Code>404</Code>
        <h1><FormattedMessage {...messages.header} /></h1>
      </div>
    )
  }
}
