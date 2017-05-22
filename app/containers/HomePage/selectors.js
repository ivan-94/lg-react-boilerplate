/*
 * state 选择器
 * @flow
 */
import { Map } from 'immutable'
import { nameSpace } from './constants'

export const selectCount = (state: Map<*, *>) =>
  state.getIn([nameSpace, 'count'])
