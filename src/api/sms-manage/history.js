import request from '@/utils/request'
export function list(data) {
  return request({
    url: '/smshistory/list',
    method: 'post',
    data
  })
}
