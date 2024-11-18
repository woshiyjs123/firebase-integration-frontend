import request from '@/utils/request'

// 查询慈善接待时间管理列表
export function listBizCharityReceptionTimeManagement(query) {
  return request({
    url: '/system/bizCharityReceptionTimeManagement/list',
    method: 'get',
    params: query
  })
}

// 查询慈善接待时间管理详细
export function getBizCharityReceptionTimeManagement(timeSlotId) {
  return request({
    url: '/system/bizCharityReceptionTimeManagement/' + timeSlotId,
    method: 'get'
  })
}

// 新增慈善接待时间管理
export function addBizCharityReceptionTimeManagement(data) {
  return request({
    url: '/system/bizCharityReceptionTimeManagement',
    method: 'post',
    data: data
  })
}

// 修改慈善接待时间管理
export function updateBizCharityReceptionTimeManagement(data) {
  return request({
    url: '/system/bizCharityReceptionTimeManagement',
    method: 'put',
    data: data
  })
}

// 删除慈善接待时间管理
export function delBizCharityReceptionTimeManagement(timeSlotId) {
  return request({
    url: '/system/bizCharityReceptionTimeManagement/' + timeSlotId,
    method: 'delete'
  })
}
