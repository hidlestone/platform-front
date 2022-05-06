import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/smsconfig/list',
    method: 'post',
    data
  })
}
export function addConfig(data) {
  return request({
    url: '/smsconfig/save',
    method: 'post',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: '/smsconfig/update',
    method: 'post',
    data
  })
}
export function deleteConfig(id) {
  return request({
    url: '/smsconfig/delete',
    method: 'post',
    params: { id }
  })
}
