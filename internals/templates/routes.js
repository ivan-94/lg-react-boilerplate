import generateHelpers from 'utils/asyncLoad'

const Noop = props => props.children
export default function createRoutes(store) {
  // 动态加载路由和注入reducer／saga, 详见./utils/asyncLoad.js
  const {
    loadStandaloneComponent, // 只是动态注入component
    loadStandaloneIndexComponent, // 只是动态注入component、作为indexRouter
    loadComponent, // 动态注入component、reudcer、saga
    loadIndexComponent, // 动态注入component、reudcer、saga、作为indexRoute
  } = generateHelpers(store, {
    componentWillLoad() {
      // 路由未载入
    },
    componentDidLoad() {
      // 路由已载入
    },
  })

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        // 动态注入容器，由于import不能动态化，所以只能显示import，导入的顺序为component、 reducer、saga
        loadComponent(
          Promise.all([
            import('containers/HomePage'),
            import('containers/HomePage/reducer'),
            import('containers/HomePage/saga'),
          ]),
          cb
        )
      },
    },
    {
      path: '*',
      name: 'notFound',
      getComponent(nextState, cb) {
        loadStandaloneComponent(import('containers/NotFoundPage'), cb)
      },
    },
  ]
}
