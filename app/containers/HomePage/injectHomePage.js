/**
 * 页面装饰器
 * 我们页面展示组件只负责展示逻辑，这样有利于业务逻辑共享和维护
 * @flow
 */
import React from 'react'
import { connect } from 'react-redux'
import { increment, decrement } from './actions'
import { selectCount } from './selectors'

/**
 * 注入容器
 * @param  {ReactComponent} Component                 装饰的组件
 * @param  {Object} optionsOrPassThroughProps 注入器的配置选项或者直接传递给被装饰组件的props
 * @return {ReactComponent}                           返回一个容器组件
 */
export default function injectHomePage(
  Component,
  optionsOrPassThroughProps: Object = {}
) {
  // 容器
  class HomePageContainer extends React.PureComponent {
    // 1⃣️ : 负责事件处理
    _handleIncrement = () => {
      this.props.dispatch(increment())
    }
    _handleDecrement = () => {
      this.props.dispatch(decrement())
    }
    render() {
      return (
        <Component
          {...optionsOrPassThroughProps}
          {...this.props}
          onIncrement={this._handleIncrement}
          onDecrement={this._handleDecrement}
        />
      )
    }
  }

  // 2⃣️: 负责链接store，并筛选需要的state
  return connect(state => ({
    count: selectCount(state),
  }))(HomePageContainer)
}
