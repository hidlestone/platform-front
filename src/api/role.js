import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

// 获取菜单树
export function getMenuTree(data) {
  return request({
    url: '/menu/getmenutree',
    method: 'post',
    data: data || {}
  })
}

// 分页查询所有角色
export function getRoles(data) {
  return request({
    url: '/role/getallrole',
    method: 'post',
    data
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: '/role/save',
    method: 'post',
    data
  })
}

// 更新角色
export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: '/role/delete',
    method: 'post',
    params: { id }
  })
}
