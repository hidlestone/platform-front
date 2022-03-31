import request from '@/utils/request'

// 账号密码登录
export function login(data) {
  return request({
    url: '/login/loginbyaccount',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
