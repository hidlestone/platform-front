import request from '@/utils/request'
export function list(data) {
  return request({
    url: '/mailhistory/list',
    method: 'post',
    data
  })
}
