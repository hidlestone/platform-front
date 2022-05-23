import request from '@/utils/request'

// 保存字典明细
export function saveDictDtl(data) {
  return request({
    url: '/dictdtl/save',
    method: 'post',
    data: data
  })
}

// 删除字典明细
export function deleteDictDtl(id) {
  return request({
    url: '/dictdtl/delete',
    method: 'post',
    params: { id }
  })
}

// 修改字典明细
export function updateDictDtl(data) {
  return request({
    url: '/dictdtl/update',
    method: 'post',
    data: data
  })
}

// 查询字典明细
export function getDictDtl(id) {
  return request({
    url: '/dictdtl/get',
    method: 'get',
    params: { id }
  })
}

// 根据字典编码查询明细
export function getDictDtlsByDictCode(dictCode) {
  return request({
    url: '/dictdtl/getdictdtlsbydictcode',
    method: 'get',
    params: { dictCode }
  })
}

// 分页查询字典明细
export function listDictDtl(data) {
  return request({
    url: '/dictdtl/list',
    method: 'post',
    data: data
  })
}
