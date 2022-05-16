import { asyncRoutes, constantRoutes } from '@/router'
import { getAllMenus } from '@/api/permission'
import Layout from '@/layout'

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

const _import = require('@/router/_import_' + process.env.NODE_ENV)// 获取组件的方法
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
            const route = {
              path: childrenTmp[i].path,
              // component: () => import('@/views/system-manage/role'),
              // component: () => import(`@/views/${childrenTmp[i].component}`),
              // component: resolve => require([`@/views/${childrenTmp[i].component}`], resolve),
              component: _import(childrenTmp[i].component),
              // component: () => import('@/views/permission/page'),
              redirect: childrenTmp[i].redirect,
              name: childrenTmp[i].name,
              meta: {
                title: childrenTmp[i].meta.title,
                icon: childrenTmp[i].meta.icon,
                roles: ['admin']
              }
            }
            children.push(route)
          }
          const route = {
            path: data[i].path,
            component: Layout,
            redirect: data[i].redirect,
            alwaysShow: data[i].alwaysShow,
            name: data[i].name,
            children: children,
            meta: {
              title: data[i].meta.title,
              icon: data[i].meta.icon,
              roles: ['admin']
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
        /*  routeArr = filterAsyncRouter(routeArr)*/
        const allRoute = routeArr.concat(accessedRoutes)

        commit('SET_ROUTES', allRoute)
        resolve(allRoute)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

/*  function filterAsyncRouter(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}*/

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
