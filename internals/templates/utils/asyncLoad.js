/**
 * 惰性加载路由组件帮助方法
 * @flow
 */
import type { Store } from 'redux'
import { getAsyncInjectors } from './asyncInjectors'

/**
 * 动态加载路由组件
 * @example
 *   ```
 *     import generateHelpers from 'utils/asyncLoad'
 *     // 生成帮助方法
 *     const {
 *       loadStandaloneComponent,      // 只是动态注入component
 *       loadIndexComponent,           // 只是动态注入component、作为indexRouter
 *       loadComponent,                // 动态注入component、reudcer、saga
 *       loadIndexComponent,           // 动态注入component、reudcer、saga、作为indexRoute
 *     } = generateHelpers(store, {
 *       componentWillLoad (store) {
 *         // 路由未载入
 *       },
 *       componentDidLoad (store, component) {
 *         // 路由已载入
 *       },
 *       onError (err) {
 *         // 错误处理
 *       },
 *     })
 *
 *    // getComponent ....
 *    getComponent (nextState, cb) {
 *      // 动态注入容器，由于import不能动态化，所以只能显示import，导入的顺序为component、 reducer、saga
 *      loadComponent(Promise.all([
 *        import('containers/HomePage'),
 *        import('containers/reducer'),
 *        import('containers/saga'),
 *      ]), cb)
 *    }
 *
 *    // getIndexRoute ....
 *    getIndexRoute (partialNextState, cb) {
 *      loadIndexComponent(Promise.all([
 *        import('containers/HomePage'),
 *        import('containers/HomePage/reducer'),
 *        import('containers/HomePage/saga'),
 *      ]), cb)
 *    },
 *
 *    // getComponent .... 只导入组件
 *    getComponent (nextState, cb) {
 *      loadStandaloneComponent(import('containers/Login/Logout'), cb)
 *    },
 *
 *    // getIndexRoute .... 只导入组件
 *    getIndexRoute (partialNextState, cb) {
 *      loadStandaloneIndexComponent(import('containers/ProjectPage'), cb)
 *    },
 *   ```
 * @param  {Store} store   redux store 实例
 * @param  {Object} options 配置
 * @return {Object}        注入器
 */
export default function generateHelpers (store: $Subtype<Store<*, *>>, options: {
  componentWillLoad?: (Store<*, *>) => void,
  componentDidLoad?: (Store<*, *>, component: any) => void,
  onError?: (err: any) => void,
} = {}) {
  // $FlowFixMe
  options = { // eslint-disable-line
    onError (err) {
      console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
    },
    ...options,
  }

  const { injectReducer, injectSagas } = getAsyncInjectors(store)
  // getComponent
  const loadModule = (cb: Function) => (componentModule: any) => {
    if (typeof options.componentDidLoad === 'function') options.componentDidLoad(store, componentModule)
    cb(null, componentModule.default || componentModule);
  }

  // getIndexRoute
  const loadIndexModule = (cb: Function) => (componentModule: any) => {
    if (typeof options.componentDidLoad === 'function') options.componentDidLoad(store, componentModule)
    cb(null, {
      component: componentModule.default || componentModule,
    })
  }

  function loadStandaloneComponent (result: Promise<any>, cb: Function) {
    if (typeof options.componentWillLoad === 'function') options.componentWillLoad(store)
    return result
    .then(loadModule(cb))
    .catch(options.onError)
  }

  function loadStandaloneIndexComponent (result: Promise<any>, cb: Function) {
    if (typeof options.componentWillLoad === 'function') options.componentWillLoad(store)
    return result
    .then(loadIndexModule(cb))
    .catch(options.onError)
  }

  function loadComponent (result: Promise<[any, any, any]>, cb: Function) {
    if (typeof options.componentWillLoad === 'function') options.componentWillLoad(store)
    return result
      .then(([component, reducer, saga]) => {
        const nameSpace = reducer.default.nameSpace
        injectReducer(nameSpace, reducer.default)
        injectSagas(nameSpace, saga.default)
        loadModule(cb)(component)
      })
      .catch(options.onError)
  }

  function loadIndexComponent (result: Promise<[any, any, any]>, cb: Function) {
    if (typeof options.componentWillLoad === 'function') options.componentWillLoad(store)
    return result
      .then(([component, reducer, saga]) => {
        const nameSpace = reducer.default.nameSpace
        injectReducer(nameSpace, reducer.default)
        injectSagas(nameSpace, saga.default)
        loadIndexModule(cb)(component)
      })
      .catch(options.onError)
  }

  return {
    injectSagas,
    injectReducer,
    loadModule,
    loadIndexModule,
    loadStandaloneIndexComponent,
    loadStandaloneComponent,
    loadComponent,
    loadIndexComponent,
  }
}
