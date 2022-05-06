import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/mailtemplate/list',
    method: 'post',
    data
  })
}
export function addTemplate(data) {
  return request({
    url: '/mailtemplate/save',
    method: 'post',
    data
  })
}

export function updateTemplate(data) {
  return request({
    url: '/mailtemplate/update',
    method: 'post',
    data
  })
}
export function deleteTemplate(id) {
  return request({
    url: '/mailtemplate/delete',
    method: 'post',
    params: { id }
  })
}
