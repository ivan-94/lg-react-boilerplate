// @flow
import type { Store } from 'redux'
import createReducer from '../reducers'

export type StoreType = Store<*, *> & {
  asyncReducers: Object,
  asyncSagaMap: Object,
  runSaga: (saga: Function) => void,
}

/**
 * Inject an asynchronously loaded reducer
 */
export function injectAsyncReducer(store: StoreType) {
  return function injectReducer(name: string, asyncReducer: Function) {
    if (Reflect.has(store.asyncReducers, name)) return

    store.asyncReducers[name] = asyncReducer // eslint-disable-line no-param-reassign
    store.replaceReducer(createReducer(store.asyncReducers))
  }
}

/**
 * Inject an asynchronously loaded saga
 * name 可以防止重复加载
 */
export function injectAsyncSagas(store: StoreType) {
  return function injectSagas(name: string, sagas: Array<Function> | Function) {
    if (Reflect.has(store.asyncSagaMap, name)) return
    store.asyncSagaMap[name] = sagas // eslint-disable-line no-param-reassign
    if (Array.isArray(sagas)) {
      sagas.map(store.runSaga)
    } else {
      store.runSaga(sagas)
    }
  }
}

/**
 * Helper for creating injectors
 */
export function getAsyncInjectors(store: StoreType) {
  return {
    injectReducer: injectAsyncReducer(store),
    injectSagas: injectAsyncSagas(store),
  }
}
