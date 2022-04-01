import { getInfo, login, logout } from '@/api/user'
import {
  getAccessToken,
  getRefreshToken,
  getToken,
  removeToken,
  setAccessToken,
  setRefreshToken,
  setToken,
  setTokenWithType
} from '@/utils/auth'
import router, { resetRouter } from '@/router'

// 单一状态树
const state = {
  token: getToken(),
  accesstoken: getAccessToken(),
  refreshtoken: getRefreshToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 设置token
  SET_ACCESSTOKEN: (state, accesstoken) => {
    state.accesstoken = accesstoken
  },
  SET_REFRESHTOKEN: (state, refreshtoken) => {
    state.accesstoken = refreshtoken
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        // 一、存储返回信息
        // 1.1、存储token
        commit('SET_TOKEN', response.data.accesstoken)
        commit('SET_ACCESSTOKEN', response.data.accesstoken)
        commit('SET_REFRESHTOKEN', response.data.refreshtoken)
        // 1.2、存储用户相关信息
        // roles must be a non-empty array
        if (!response.data.roles || response.data.roles.length <= 0) {
          reject('roles must be a non-null array!')
        }
        commit('SET_ROLES', response.data.roles)
        commit('SET_NAME', response.data.curUserInfo.username)
        commit('SET_AVATAR', response.data.curUserInfo.avatar)
        commit('SET_INTRODUCTION', response.data.curUserInfo.introduction)
        // 二、设置token，存储token到cookie中
        setAccessToken(response.data.accesstoken)
        setRefreshToken(response.data.refreshtoken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  // 重新获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.accesstoken).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, username, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  // 用户登出
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.accesstoken).then(() => {
        // 清空token状态state
        commit('SET_TOKEN', null)
        commit('SET_ACCESSTOKEN', null)
        commit('SET_REFRESHTOKEN', null)
        // 清空角色
        commit('SET_ROLES', [])
        // 清空cookie中的token
        removeToken()
        // 重置route
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ACCESSTOKEN', null)
      commit('SET_REFRESHTOKEN', null)
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
