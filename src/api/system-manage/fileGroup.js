import request from '@/utils/request'

// 删除文件组
export function deleteFileGroup(id) {
  return request({
    url: '/filegroup/delete',
    method: 'post',
    params: { id }
  })
}

// 查询文件组
export function getFileGroup(id) {
  return request({
    url: '/filegroup/get',
    method: 'get',
    params: { id }
  })
}

// 分页查询文件组
export function listFileGroup(data) {
  return request({
    url: '/filegroup/list',
    method: 'post',
    data: data
  })
}
