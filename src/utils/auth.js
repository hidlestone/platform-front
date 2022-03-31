import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 根据类型设置token
export function setTokenWithType(tokenType, token) {
  return Cookies.set(tokenType, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
