import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/mailsender/list',
    method: 'post',
    data
  })
}
export function addConfig(data) {
  return request({
    url: '/mailsender/save',
    method: 'post',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: '/mailsender/update',
    method: 'post',
    data
  })
}
export function deleteConfig(id) {
  return request({
    url: '/mailsender/delete',
    method: 'post',
    params: { id }
  })
}
