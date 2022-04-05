// 导入request.js，封装了axios
import request from '@/utils/request'

// 获取所有菜单对应的路由
export function getAllMenus() {
  return request({
    url: '/menu/getallmenus',
    method: 'get'
  })
}


