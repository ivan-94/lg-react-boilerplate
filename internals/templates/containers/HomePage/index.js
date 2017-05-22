/*
 * 首页
 * @flow
 */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import injectHomePage from './injectHomePage'

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render () {
    return (<div>
      <h1>
        <FormattedMessage {...messages.header} />
      </h1>
      <h2>Count: {this.props.count}</h2>
      <button onClick={this.props.onIncrement}>increment</button>
      <button onClick={this.props.onDecrement}>decrement</button>
    </div>)
  }
}

export default injectHomePage(HomePage)
