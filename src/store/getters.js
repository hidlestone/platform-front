// Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。
// Getter 会暴露为 store.getters 对象，你可以以属性的形式访问这些值：
const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  accesstoken: state => state.user.accesstoken,
  refreshtoken: state => state.user.refreshtoken,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,

  // 路由
  routes: state => state.permission.routes
}
export default getters
