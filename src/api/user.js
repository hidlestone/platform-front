import request from '@/utils/request'

// 账号密码登录
export function login(data) {
  return request({
    url: '/login/loginbyaccount',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/user/getuserinfo',
    method: 'get'
  })
}

// 用户登出
export function logout(accesstoken) {
  return request({
    url: '/user/logout',
    method: 'get',
    params: { accesstoken }
  })
}
