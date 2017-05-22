// @flow
import { fromJS, Map } from 'immutable'
import {
  nameSpace,
  INCREMENT,
  DECREMENT,
} from './constants'

// 初始state
const initialState = fromJS({
  count: 0,
})

function reducer (
  state: Map<*, *> = initialState,
  action: Redux$Action,
) {
  switch (action.type) {
    case INCREMENT:
      return state.set('count', state.get('count') + 1)
    case DECREMENT:
      return state.set('count', state.get('count') - 1)
    default:
      return state
  }
}

// 按照约定导出命名空间
reducer.nameSpace = nameSpace
export default reducer
