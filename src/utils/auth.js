import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

// 获取访问token
export function getAccessToken() {
  return Cookies.get('accesstoken')
}

// 获取刷新token
export function getRefreshToken() {
  return Cookies.get('refreshtoken')
}

// 设置访问token
export function setAccessToken(token) {
  return Cookies.set('accesstoken', token)
}

// 设置刷新token
export function setRefreshToken(token) {
  return Cookies.set('refreshtoken', token)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 根据类型设置token
export function setTokenWithType(tokenType, token) {
  return Cookies.set(tokenType, token)
}

// 清空cookie中的token
export function removeToken() {
  Cookies.remove('accesstoken')
  Cookies.remove('refreshtoken')
  return Cookies.remove(TokenKey)
}
