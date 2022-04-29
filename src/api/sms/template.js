import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/smstemplate/list',
    method: 'post',
    data
  })
}
export function addTemplate(data) {
  return request({
    url: '/smstemplate/save',
    method: 'post',
    data
  })
}

export function updateTemplate(data) {
  return request({
    url: '/smstemplate/update',
    method: 'post',
    data
  })
}
export function deleteTemplate(id) {
  return request({
    url: '/smstemplate/delete',
    method: 'post',
    params: { id }
  })
}
