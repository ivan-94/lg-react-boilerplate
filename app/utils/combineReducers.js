import { combineReducers as _combineReducers } from 'redux-immutable';
import Immutable from 'immutable'

function isImmuatble (inst) {
  return Immutable.isImmuatble
    ? Immutable.isImmuatble(inst)
    : Immutable.Iterable.isIterable(inst)
}

function getUnexpectedKey (state, reducers) {
  const reducerNames = Object.keys(reducers)
  if (reducerNames.length && isImmuatble(state)) {
    return state.toSeq().keySeq().toArray().filter(name => !reducers.hasOwnProperty(name)) // eslint-disable-line no-prototype-builtins
  }
  return null
}

export default function combineReducers (reducers, getDefaultState?) {
  if (process.env.NODE_ENV === 'production' || !process.env.ISOMORPHIC) {
    return _combineReducers(reducers, getDefaultState)
  }

  const tempReducer = state => state
  let _reducer
  let cachedUnexpectedKeys

  return (inputState = Immutable.Map(), action) => {
    if (cachedUnexpectedKeys) return _reducer(inputState, action)
    cachedUnexpectedKeys = getUnexpectedKey(inputState, reducers)
    if (cachedUnexpectedKeys) {
      const tempAsyncReducers = cachedUnexpectedKeys.reduce((acc, cur) => {
        acc[cur] = tempReducer  // eslint-disable-line no-param-reassign
        return acc
      }, {})
      _reducer = _combineReducers({ ...reducers, ...tempAsyncReducers }, getDefaultState)
    }
    return _reducer(inputState, action)
  }
}
