import request from '@/utils/request'

// 保存系统参数明细
export function saveSysParam(data) {
  return request({
    url: '/sysparam/save',
    method: 'post',
    data: data
  })
}

// 删除系统参数明细
export function deleteSysParam(code) {
  return request({
    url: '/sysparam/delete',
    method: 'post',
    params: { code }
  })
}

// 修改系统参数明细
export function updateSysParam(data) {
  return request({
    url: '/sysparam/update',
    method: 'post',
    data: data
  })
}

// 查询系统参数明细
export function getSysParam(id) {
  return request({
    url: '/sysparam/get',
    method: 'get',
    params: { id }
  })
}

// 根据配置组编码查询配置明细项
export function getSysParam(groupCode) {
  return request({
    url: '/sysparam/getsysparam',
    method: 'get',
    params: { groupCode }
  })
}

// 分页查询字典
export function listSysParam(data) {
  return request({
    url: '/sysparam/list',
    method: 'post',
    data: data
  })
}


