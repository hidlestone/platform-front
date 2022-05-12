import request from '@/utils/request'

// 保存菜单
export function saveMenu(data) {
  return request({
    url: '/menu/save',
    method: 'post',
    data: data
  })
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: '/menu/delete',
    method: 'post',
    params: { id }
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/menu/update',
    method: 'post',
    data: data
  })
}

// 查询菜单
export function getMenu(id) {
  return request({
    url: '/menu/get',
    method: 'get',
    params: { id }
  })
}

// 分页查询菜单
export function listMenu(data) {
  return request({
    url: '/menu/list',
    method: 'post',
    data: data
  })
}
