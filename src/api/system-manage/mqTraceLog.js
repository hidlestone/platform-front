import request from '@/utils/request'

// 删除MQ轨迹日志
export function deleteMqTraceLog(id) {
  return request({
    url: '/mqtracelog/delete',
    method: 'post',
    params: { id }
  })
}

// 查询MQ轨迹日志
export function getMqTraceLog(id) {
  return request({
    url: '/mqtracelog/get',
    method: 'get',
    params: { id }
  })
}

// 分页查询MQ轨迹日志
export function listMqTraceLog(data) {
  return request({
    url: '/mqtracelog/list',
    method: 'post',
    data: data
  })
}
