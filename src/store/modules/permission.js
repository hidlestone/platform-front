import { asyncRoutes, constantRoutes } from '@/router'
import { getAllMenus } from '@/api/permission'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 根据角色获取路由
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      let accessedRoutes
      // 获取当前用户可以访问的菜单路由
      getAllMenus().then(response => {
        const { data } = response
        const routeArr = []
        for (let i = 0, len = data.length; i < len; i++) {
          const children = []
          const childrenTmp = data[i].children
          for (let i = 0, len = childrenTmp.length; i < len; i++) {
            let route = {
              path: childrenTmp[i].path,
              // component: () => import('@/views/systemmanagement/role'),
              component: () => import(`@/views/${childrenTmp[i].component}`),
              // component: resolve => require([`@/views/${childrenTmp[i].component}`], resolve),
              redirect: childrenTmp[i].redirect,
              /*alwaysShow: childrenTmp[i].alwaysShow,*/
              name: childrenTmp[i].name,
              meta: {
                title: childrenTmp[i].meta.title,
                /*icon: childrenTmp[i].meta.icon,*/
                roles: []
              }
            }
            children.push(routeSub)
          }
          let route = {
            path: data[i].path,
            component: data[i].component,
            redirect: data[i].redirect,
            alwaysShow: data[i].alwaysShow,
            name: data[i].name,
            children: children,
            meta: {
              title: data[i].meta.title,
              icon: data[i].meta.icon,
              roles: null
            }
          }
          routeArr.push(route)
        }
        // 如果是admin则使用当前设置的全量路由
        if (roles.includes('admin')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        }
        const allRoute = routeArr.concat(accessedRoutes)
        commit('SET_ROUTES', allRoute)
        resolve(allRoute)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
