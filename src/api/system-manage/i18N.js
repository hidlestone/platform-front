import request from '@/utils/request'

// 保存多语言词条
export function saveI18N(data) {
  return request({
    url: '/i18n/save',
    method: 'post',
    data: data
  })
}

// 批量保存多语言词条
export function saveBatchI18N(data) {
  return request({
    url: '/i18n/savebatch',
    method: 'post',
    data: data
  })
}

// 删除多语言词条
export function deleteI18N(id) {
  return request({
    url: '/i18n/delete',
    method: 'post',
    params: { id }
  })
}

// 修改多语言词条
export function updateI18N(data) {
  return request({
    url: '/i18n/update',
    method: 'post',
    data: data
  })
}

// 查询多语言词条
export function getI18N(id) {
  return request({
    url: '/i18n/get',
    method: 'get',
    params: { id }
  })
}

// 分页查询多语言词条
export function listI18N(data) {
  return request({
    url: '/i18n/list',
    method: 'post',
    data: data
  })
}

