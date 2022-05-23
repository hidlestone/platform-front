import request from '@/utils/request'

// 保存字典
export function saveDict(data) {
  return request({
    url: '/dict/savedict',
    method: 'post',
    data: data
  })
}

// 删除字典
export function deleteDict(id) {
  return request({
    url: '/dict/delete',
    method: 'post',
    params: { id }
  })
}

// 修改字典
export function updateDict(data) {
  return request({
    url: '/dict/update',
    method: 'post',
    data: data
  })
}

// 查询字典
export function getDict(id) {
  return request({
    url: '/dict/get',
    method: 'get',
    params: { id }
  })
}

// 分页查询字典
export function listDict(data) {
  return request({
    url: '/dict/list',
    method: 'post',
    data: data
  })
}

// 查询所有字典项
export function getAllDicts() {
  return request({
    url: '/dict/getalldicts',
    method: 'post'
  })
}
