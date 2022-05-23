import request from '@/utils/request'

// 上传文件组
export function uploadFileGroup(data) {
  return request({
    url: '/localfileprocess/uploadfilegroup',
    method: 'post',
    data: data
  })
}

// 下载文件
export function downloadFile(id) {
  return request({
    url: '/localfileprocess/downloadfile',
    method: 'post',
    params: { id }
  })
}

