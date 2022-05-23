import request from '@/utils/request'

// 保存系统参数组
export function saveSysParamGroup(data) {
  return request({
    url: '/sysparamgroup/save',
    method: 'post',
    data: data
  })
}

// 删除系统参数组
export function deleteSysParamGroup(code) {
  return request({
    url: '/sysparamgroup/delete',
    method: 'post',
    params: { code }
  })
}

// 修改系统参数组
export function updateSysParamGroup(data) {
  return request({
    url: '/sysparamgroup/update',
    method: 'post',
    data: data
  })
}

// 查询系统参数组
export function getSysParamGroup(code) {
  return request({
    url: '/sysparamgroup/get',
    method: 'get',
    params: { code }
  })
}

// 分页查询系统参数组
export function listSysParamGroup(data) {
  return request({
    url: '/sysparamgroup/list',
    method: 'post',
    data: data
  })
}

